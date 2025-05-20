# Vendor Dashboard - Deployment Guide

This guide provides instructions for deploying the Vendor Dashboard application to AWS:
- Backend: AWS Lambda + API Gateway
- Frontend: AWS Amplify
- WebSockets: API Gateway WebSocket API

## Prerequisites

1. AWS CLI installed and configured with appropriate credentials
2. Node.js 18+ installed
3. Serverless Framework: `npm install -g serverless`

## Backend Deployment (AWS Lambda)

### 1. Set up environment variables in AWS SSM Parameter Store

Create the following parameters in AWS Systems Manager Parameter Store:

```bash
# Example commands - replace values with your actual secrets
aws ssm put-parameter --name "/vendor-dashboard/prod/MONGODB_URI" --value "mongodb+srv://dhanush:Dhanush123@caasdiglobal.yahxc.mongodb.net/?retryWrites=true&w=majority&appName=CaasdiGlobal" --type "SecureString"

aws ssm put-parameter --name "/vendor-dashboard/prod/SESSION_SECRET" --value "517f384b904d4e8a04abfc2ed2cad1422c59b472241bc6fa06908f5dfe93b2e2" --type "SecureString"

aws ssm put-parameter --name "/vendor-dashboard/prod/GOOGLE_CLIENT_ID" --value "540364621159-6anfmspca2foov8tif1gvak3vqg089v3.apps.googleusercontent.com" --type "SecureString"


aws ssm put-parameter --name "/vendor-dashboard/prod/GOOGLE_CLIENT_SECRET" --value "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" --type "SecureString"

aws ssm put-parameter --name "/vendor-dashboard/prod/FRONTEND_URL" --value "http://localhost:5173" --type "String"

aws ssm put-parameter --name "/vendor-dashboard/prod/S3_BUCKET_NAME" --value "mac-vendor-uploads" --type "String"
```

### 2. Deploy to AWS Lambda

```bash
# Install dependencies
npm install

# Deploy to development environment
npm run deploy:dev

# OR deploy to production environment
npm run deploy
```

After deployment, note the API Gateway endpoint URL provided in the output.

## Frontend Deployment (AWS Amplify)

1. Go to the AWS Amplify Console: https://console.aws.amazon.com/amplify
2. Choose "New app" > "Host web app"
3. Connect to your repository (GitHub, GitLab, Bitbucket, etc.)
4. Select the branch to deploy
5. Configure build settings with the appropriate build command for your frontend

### Environment Variables for Frontend

Add these environment variables in the Amplify Console:

- `VITE_API_URL`: The API Gateway URL from the backend deployment
- `VITE_WEBSOCKET_URL`: The WebSocket URL from the backend deployment
- Any other environment variables your frontend needs

## WebSocket Setup

After deploying the backend, you'll get a WebSocket URL. Update your frontend to use this URL for WebSocket connections.

## Updating the Frontend URL

After deploying your frontend, update the FRONTEND_URL parameter in SSM Parameter Store:

```bash
aws ssm put-parameter --name "/vendor-dashboard/dev/FRONTEND_URL" --value "https://your-amplify-url.amplifyapp.com" --type "String" --overwrite
```

Then redeploy your backend to update the CORS configuration:

```bash
npm run deploy:dev
``` 

REST API: https://2dqw0u99ml.execute-api.us-east-1.amazonaws.com/api/{proxy+}
WebSockets API: wss://3xnxbg80a8.execute-api.us-east-1.amazonaws.com/dev