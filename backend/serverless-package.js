import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Create a minimal version for deployment
const minimalPackage = {
  name: packageJson.name,
  version: packageJson.version,
  type: packageJson.type,
  dependencies: {
    // Only include essential dependencies
    'aws-sdk': packageJson.dependencies['aws-sdk'],
    'cors': packageJson.dependencies['cors'],
    'dotenv': packageJson.dependencies['dotenv'],
    'express': packageJson.dependencies['express'],
    'express-session': packageJson.dependencies['express-session'],
    'mongoose': packageJson.dependencies['mongoose'],
    'passport': packageJson.dependencies['passport'],
    'passport-google-oauth20': packageJson.dependencies['passport-google-oauth20'],
    'serverless-http': packageJson.dependencies['serverless-http'],
    'uuid': packageJson.dependencies['uuid'],
    'jsonwebtoken': packageJson.dependencies['jsonwebtoken'],
    'jwk-to-pem': packageJson.dependencies['jwk-to-pem'],
    'jwks-rsa': packageJson.dependencies['jwks-rsa'],
    'multer': packageJson.dependencies['multer'],
    'ws': packageJson.dependencies['ws']
    // Add other critical dependencies as needed
  }
};

// Write to a temporary file
fs.writeFileSync('./deployment-package.json', JSON.stringify(minimalPackage, null, 2));
console.log('Created minimal package.json for deployment'); 