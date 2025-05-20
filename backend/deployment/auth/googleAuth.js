/**
 * DEPRECATED: This file is no longer used in the application.
 * It has been replaced by DynamoDB implementations.
 * Kept for reference only.
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleUser = require('../models/GoogleUser');

// Replace with your actual Google client credentials
const GOOGLE_CLIENT_ID = '540364621159-6anfmspca2foov8tif1gvak3vqg089v3.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Save profile info to DB or session
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });
        if (!user) {
          user = await GoogleUser.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: null
          });
        }
        if (!user.googleId) {
          console.error('Google authentication failed - no googleId');
          return done(new Error('Missing googleId'), null);
        }
        done(null, {
          googleId: user.googleId,
          _id: user._id,
          role: user.role
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, {
    googleId: user.googleId,
    _id: user._id,
    role: user.role
  });
});

passport.deserializeUser(async (user, done) => {
  try {
    const dbUser = await GoogleUser.findById(user._id);
    done(null, dbUser);
  } catch (err) {
    done(err, null);
  }
});
