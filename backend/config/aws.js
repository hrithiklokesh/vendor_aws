import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

console.log('AWS Configuration:');
console.log('Region:', process.env.AWS_REGION || 'us-east-1');
console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set (hidden)' : 'Not set');
console.log('Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set (hidden)' : 'Not set');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create S3 client
const s3 = new AWS.S3();

// S3 bucket name
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'mac-vendor-uploads';

// Table names
const VENDORS_TABLE = 'vendors';
const GOOGLE_USERS_TABLE = 'google_users';
const LEADS_TABLE = 'leads';
const PROJECTS_TABLE = 'projects';

export { dynamoDB, s3, VENDORS_TABLE, GOOGLE_USERS_TABLE, LEADS_TABLE, PROJECTS_TABLE, S3_BUCKET_NAME };