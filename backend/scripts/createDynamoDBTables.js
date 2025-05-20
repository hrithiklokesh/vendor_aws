import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { VENDORS_TABLE, GOOGLE_USERS_TABLE } from '../config/aws.js';

// Define the leads table name
const LEADS_TABLE = 'leads';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('AWS Credentials:');
console.log('Region:', process.env.AWS_REGION);
console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Found' : 'Missing');
console.log('Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Found' : 'Missing');

// Configure AWS SDK
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials are missing in the .env file!');
  process.exit(1);
}

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // Disable credential loading from EC2 metadata service
  httpOptions: {
    timeout: 5000,
    connectTimeout: 5000
  }
});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB();

// Create vendors table if it doesn't exist
const createVendorsTable = async () => {
  const params = {
    TableName: VENDORS_TABLE,
    KeySchema: [
      { AttributeName: 'vendorId', KeyType: 'HASH' }  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'vendorId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    // Check if table exists
    try {
      await dynamodb.describeTable({ TableName: VENDORS_TABLE }).promise();
      console.log(`Table ${VENDORS_TABLE} already exists`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        // Create table if it doesn't exist
        await dynamodb.createTable(params).promise();
        console.log(`Created table ${VENDORS_TABLE}`);
        
        // Wait for table to be created
        console.log('Waiting for table to be active...');
        await dynamodb.waitFor('tableExists', { TableName: VENDORS_TABLE }).promise();
        console.log('Table is now active');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating vendors table:', error);
    throw error;
  }
};

// Create Google users table if it doesn't exist
const createGoogleUsersTable = async () => {
  const params = {
    TableName: GOOGLE_USERS_TABLE,
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    // Check if table exists
    try {
      await dynamodb.describeTable({ TableName: GOOGLE_USERS_TABLE }).promise();
      console.log(`Table ${GOOGLE_USERS_TABLE} already exists`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        // Create table if it doesn't exist
        await dynamodb.createTable(params).promise();
        console.log(`Created table ${GOOGLE_USERS_TABLE}`);
        
        // Wait for table to be created
        console.log('Waiting for table to be active...');
        await dynamodb.waitFor('tableExists', { TableName: GOOGLE_USERS_TABLE }).promise();
        console.log('Table is now active');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating Google users table:', error);
    throw error;
  }
};

// Create leads table if it doesn't exist
const createLeadsTable = async () => {
  const params = {
    TableName: LEADS_TABLE,
    KeySchema: [
      { AttributeName: 'leadId', KeyType: 'HASH' }  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'leadId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    // Check if table exists
    try {
      await dynamodb.describeTable({ TableName: LEADS_TABLE }).promise();
      console.log(`Table ${LEADS_TABLE} already exists`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        // Create table if it doesn't exist
        await dynamodb.createTable(params).promise();
        console.log(`Created table ${LEADS_TABLE}`);
        
        // Wait for table to be created
        console.log('Waiting for table to be active...');
        await dynamodb.waitFor('tableExists', { TableName: LEADS_TABLE }).promise();
        console.log('Table is now active');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating leads table:', error);
    throw error;
  }
};

// Create all tables
const createTables = async () => {
  try {
    await createVendorsTable();
    await createGoogleUsersTable();
    await createLeadsTable();
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Run the script
createTables();