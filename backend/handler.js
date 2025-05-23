const serverlessExpress = require('@vendia/serverless-express');
const app = require('./server'); // Adjust if your app is in a different file

exports.handler = serverlessExpress({ app });
