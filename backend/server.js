import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport'; 
import mongoose from 'mongoose';
import './config/passport.js';
import { initWebSocketServer } from './websocket/notificationSocket.js';
import connectDB from './config/db.js';

// Import routes and models
import vendorRoutes from './routes/vendorRoutes.js';
import dynamoVendorRoutes from './routes/dynamoVendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dynamoAuthRoutes from './routes/dynamoAuthRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import productRoutes from './routes/productRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import dynamoLeadRoutes from './routes/dynamoLeadRoutes.js';
import dynamoProjectLeadRoutes from './routes/dynamoProjectLeadRoutes.js';
import dynamoProjectRoutes from './routes/dynamoProjectRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { createContact } from './models/DynamoContact.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5001',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const contactData = { firstName, lastName, email, phone, message };
    await createContact(contactData);
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.use('/api/vendor', dynamoVendorRoutes);
app.use('/api/auth', dynamoAuthRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/vendor', productRoutes);
app.use('/api/vendor', serviceRoutes);
app.use('/api', dynamoLeadRoutes);
app.use('/api/project-leads', dynamoProjectLeadRoutes);
app.use('/api', dynamoProjectRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// ✅ Export the app for Lambda
export default app;
