import express from "express";
import passport from "passport";
import * as DynamoVendor from "../models/DynamoVendor.js";
import * as DynamoGoogleUser from "../models/DynamoGoogleUser.js";
import jwt from "jsonwebtoken"; // Add jsonwebtoken for token validation
import jwkToPem from "jwk-to-pem"; // Convert JWK to PEM for verification
import axios from "axios"; // For fetching JWKS
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Fetch and cache Cognito JWKS
let jwks = {};
const fetchJwks = async () => {
  try {
    const response = await axios.get(
      `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
    );
    jwks = response.data;
  } catch (error) {
    console.error("Error fetching JWKS:", error);
  }
};
fetchJwks(); // Initial fetch

// Function to get PEM from JWKS based on kid
const getPem = (kid) => {
  const key = jwks.keys.find((k) => k.kid === kid);
  return key ? jwkToPem(key) : null;
};

// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const { email, displayName, id: googleId } = req.user;

      // First try to find in DynamoDB vendors
      let vendor = await DynamoVendor.getVendorByEmail(email);
      
      // If not found in vendors, try DynamoDB Google users
      let googleUser = null;
      if (!vendor) {
        googleUser = await DynamoGoogleUser.getGoogleUserByEmail(email);
      }

      // If not found in either table, create a new Google user
      if (!vendor && !googleUser) {
        console.log("Creating new Google user in DynamoDB:", email);
        
        // Create new Google user
        const newGoogleUserData = {
          googleId,
          displayName,
          email,
          role: 'vendor',
          status: 'pending',
          hasFilledForm: false
        };
        
        googleUser = await DynamoGoogleUser.createGoogleUser(newGoogleUserData);
        console.log("Created new Google user:", googleUser);
      }

      // Determine status and hasFilledForm based on which record we found
      let status = 'pending';
      let role = 'vendor';
      let hasFilledForm = false;
      
      if (vendor) {
        // Check if form is complete based on vendor data
        hasFilledForm = Boolean(
          vendor.hasFilledForm || 
          (vendor.vendorDetails && 
           Object.keys(vendor.vendorDetails).length > 0 && 
           vendor.companyDetails && 
           Object.keys(vendor.companyDetails).length > 0 && 
           vendor.serviceProductDetails && 
           Object.keys(vendor.serviceProductDetails).length > 0 && 
           vendor.bankDetails && 
           Object.keys(vendor.bankDetails).length > 0 && 
           vendor.complianceCertifications && 
           Object.keys(vendor.complianceCertifications).length > 0 && 
           vendor.additionalDetails && 
           Object.keys(vendor.additionalDetails).length > 0)
        );
        
        // Update hasFilledForm if needed
        if (hasFilledForm && !vendor.hasFilledForm) {
          const updatedVendorData = {
            hasFilledForm: true
          };
          
          await DynamoVendor.updateVendor(vendor.id, updatedVendorData);
        }
        
        status = vendor.status || 'pending';
        role = vendor.role || 'vendor';
      } else if (googleUser) {
        // Use data from Google user
        status = googleUser.status || 'pending';
        hasFilledForm = googleUser.hasFilledForm || false;
        role = googleUser.role || 'vendor';
      }
      
      console.log("Google callback - user status:", {
        email,
        status,
        hasFilledForm,
        role,
        source: vendor ? 'vendor' : 'googleUser'
      });

      // Determine where to redirect based on status and form completion
      let redirectUrl;
      
      if (status === 'approved' && hasFilledForm) {
        // If user is approved and has filled the form, redirect directly to dashboard
        redirectUrl = `http://localhost:5173/VendorDashboard?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`;
      } else {
        // Otherwise, redirect to login with status parameters
        redirectUrl = `http://localhost:5173/login?token=true&email=${encodeURIComponent(email)}&status=${encodeURIComponent(status)}&filledForm=${hasFilledForm ? 'true' : 'false'}&role=${encodeURIComponent(role)}`;
      }
      
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("OAuth Callback Error:", err);
      res.redirect("http://localhost:5173/login?error=server");
    }
  }
);

// Role selection route
router.post("/set-role", async (req, res) => {
  const { role } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  try {
    let user;

    // Handle Google authentication (Passport.js session)
    if (req.user) {
      console.log("Attempting to update role for user ID:", req.user._id);
      
      // Find user in DynamoDB Google users by email
      if (req.user.email) {
        user = await DynamoGoogleUser.getGoogleUserByEmail(req.user.email);
        
        if (user) {
          console.log("Found user in DynamoDB Google users:", user.email);
        }
      }
      
      if (!user) {
        console.log("User not found in DB for ID:", req.user._id);
        return res.status(404).json({ error: "User not found" });
      }
    }
    // Handle Cognito authentication (JWT token)
    else if (token) {
      // Verify Cognito token
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const kid = decodedToken.header.kid;
      const pem = getPem(kid);
      if (!pem) {
        return res.status(401).json({ error: "Invalid key ID" });
      }

      // Use promise-based jwt.verify
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const userId = decoded.sub; // Cognito user sub (unique identifier)
      console.log("Attempting to update role for Cognito user ID:", userId);
      user = await GoogleUser.findOne({ cognitoId: userId }); // Use cognitoId instead of googleId
      if (!user) {
        // Create new user if not found (optional)
        user = new GoogleUser({
          cognitoId: userId,
          email: decoded.email || "", // Add email if available in token
          displayName: decoded.name || "", // Add displayName if available
          role: role,
        });
        await user.save();
        console.log("New user created with Cognito ID:", userId);
      }
    } else {
      console.log("No authenticated user in session or token");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Update the role in DynamoDB
    await DynamoGoogleUser.updateGoogleUser(user.id, { role });
    console.log("Role updated in DynamoDB:", user.email, role);
    
    res.json({ message: "Role saved successfully" });
  } catch (err) {
    console.error("Error updating role:", err.stack);
    res.status(500).json({ error: "Failed to save role" });
  }
});

// Verify authentication
router.get("/verify", async (req, res) => {
  if (req.isAuthenticated() && req.user) {
    console.log("Verify endpoint, user:", req.user);
    
    // Find in DynamoDB Google users by email
    if (req.user.email) {
      const dynamoUser = await DynamoGoogleUser.getGoogleUserByEmail(req.user.email);
      
      if (dynamoUser) {
        return res.json({
          googleId: dynamoUser.googleId,
          email: dynamoUser.email,
          role: dynamoUser.role || 'vendor',
          source: 'dynamodb'
        });
      }
    }
    
    // Use session user data if DynamoDB lookup fails
    return res.json({
      googleId: req.user.googleId,
      email: req.user.email,
      role: req.user.role || 'vendor',
      source: 'dynamodb'
    });
  }
  // Add Cognito token verification for /verify
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const kid = decodedToken.header.kid;
      const pem = getPem(kid);
      if (!pem) {
        return res.status(401).json({ error: "Invalid key ID" });
      }

      // Use promise-based jwt.verify
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const userId = decoded.sub;
      
      // Find in DynamoDB Google users by email
      let dynamoUser = await DynamoGoogleUser.getGoogleUserByEmail(decoded.email);
      
      // If user not found in DynamoDB, create a new user record
      if (!dynamoUser) {
        console.log("User not found in DynamoDB, creating new user with email:", decoded.email);
        
        // Create new user in DynamoDB
        const newUserData = {
          cognitoId: userId,
          googleId: null, // No Google ID for Cognito users
          email: decoded.email,
          displayName: decoded.name || decoded.email.split('@')[0],
          role: 'vendor',
          status: 'pending',
          hasFilledForm: false
        };
        
        dynamoUser = await DynamoGoogleUser.createGoogleUser(newUserData);
        console.log("Created new user in DynamoDB:", dynamoUser);
      }
      
      if (dynamoUser) {
        return res.json({
          googleId: dynamoUser.googleId || null,
          email: dynamoUser.email,
          role: dynamoUser.role || 'vendor',
          source: 'dynamodb'
        });
      }
      
      return res.status(404).json({ error: "User not found and could not be created" });
    } catch (err) {
      console.error("Error verifying token:", err.stack);
      return res.status(401).json({ error: "Not authenticated" });
    }
  }
  return res.status(401).json({ error: "Not authenticated" });
});

export default router;