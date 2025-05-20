import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport'; 
import mongoose from 'mongoose';

// Import both MongoDB and DynamoDB routes
import connectDB from './config/db.js';
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
import './config/passport.js'; // Loads Google OAuth strategy

dotenv.config();

const app = express();

// Connect to MongoDB (still needed for GoogleUser model)
connectDB(); // your reusable connectDB function

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5001',
    'http://localhost:3000',
    // Add your Amplify URL here once deployed
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config - for Lambda we'd typically use a different approach or disable
// Consider using JWT tokens or a different session store for Lambda
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'someRandomSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true, 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Passport config
app.use(passport.initialize());
app.use(passport.session());

// Import DynamoDB contact model
import { createContact } from './models/DynamoContact.js';

// === Route for landing page contact form using DynamoDB ===
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

// === API Routes for vendor platform ===
// Use DynamoDB routes instead of MongoDB routes
app.use('/api/vendor', dynamoVendorRoutes);
app.use('/api/auth', dynamoAuthRoutes); // Google login/callback/set-role
app.use('/api/files', fileRoutes); // File upload/delete routes
app.use('/api/vendor', productRoutes); // Product routes
app.use('/api/vendor', serviceRoutes); // Service routes
app.use('/api', dynamoLeadRoutes); // Leads routes
app.use('/api/project-leads', dynamoProjectLeadRoutes); // Project leads routes
app.use('/api', dynamoProjectRoutes); // Projects routes
app.use('/api/notifications', notificationRoutes); // Notifications routes

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app; 