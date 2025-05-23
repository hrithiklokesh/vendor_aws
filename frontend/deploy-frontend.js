const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  bucketName: 'YOUR_S3_BUCKET_NAME',
  cloudFrontDistributionId: 'YOUR_CLOUDFRONT_DISTRIBUTION_ID',
  region: 'YOUR_AWS_REGION', // e.g., 'us-east-1'
};

// Initialize AWS clients
const s3Client = new S3Client({ region: config.region });
const cloudFrontClient = new CloudFrontClient({ region: config.region });

async function deploy() {
  try {
    // Build the frontend
    console.log('Building frontend...');
    execSync('npm run build', { stdio: 'inherit' });

    // Upload files to S3
    console.log('Uploading files to S3...');
    const distPath = path.join(__dirname, 'dist');
    const files = getAllFiles(distPath);

    for (const file of files) {
      const relativePath = path.relative(distPath, file);
      const fileContent = fs.readFileSync(file);
      
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: relativePath,
        Body: fileContent,
        ContentType: getContentType(relativePath),
        CacheControl: 'max-age=31536000', // 1 year cache for static assets
      });

      await s3Client.send(command);
      console.log(`Uploaded: ${relativePath}`);
    }

    // Invalidate CloudFront cache
    console.log('Invalidating CloudFront cache...');
    const invalidationCommand = new CreateInvalidationCommand({
      DistributionId: config.cloudFrontDistributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*'],
        },
      },
    });

    await cloudFrontClient.send(invalidationCommand);
    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
  };

  return contentTypes[ext] || 'application/octet-stream';
}

deploy(); 