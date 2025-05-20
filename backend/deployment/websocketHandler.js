import { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE || 'websocket-connections';

// Connect handler
export const connect = async (event) => {
  const connectionId = event.requestContext.connectionId;
  
  try {
    await dynamodb.put({
      TableName: CONNECTIONS_TABLE,
      Item: {
        connectionId,
        timestamp: new Date().toISOString(),
      },
    }).promise();
    
    return { statusCode: 200, body: 'Connected' };
  } catch (error) {
    console.error('Error connecting:', error);
    return { statusCode: 500, body: 'Failed to connect' };
  }
};

// Disconnect handler
export const disconnect = async (event) => {
  const connectionId = event.requestContext.connectionId;
  
  try {
    await dynamodb.delete({
      TableName: CONNECTIONS_TABLE,
      Key: { connectionId },
    }).promise();
    
    return { statusCode: 200, body: 'Disconnected' };
  } catch (error) {
    console.error('Error disconnecting:', error);
    return { statusCode: 500, body: 'Failed to disconnect' };
  }
};

// Message handler
export const message = async (event) => {
  const connectionId = event.requestContext.connectionId;
  let body;
  
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: 'Invalid request body' };
  }
  
  // Process the message as needed
  console.log(`Message from ${connectionId}:`, body);
  
  return { statusCode: 200, body: 'Message received' };
};

// Send notification to specific connection
export const sendNotification = async (connectionId, data) => {
  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: process.env.WEBSOCKET_API_URL
  });
  
  try {
    await apiGatewayManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(data),
    }).promise();
    return true;
  } catch (error) {
    if (error.statusCode === 410) {
      // Connection is stale, remove it
      await dynamodb.delete({
        TableName: CONNECTIONS_TABLE,
        Key: { connectionId },
      }).promise();
    } else {
      console.error('Error sending message:', error);
    }
    return false;
  }
};

// Broadcast to all connections
export const broadcast = async (data) => {
  // Get all connections
  const { Items: connections } = await dynamodb.scan({
    TableName: CONNECTIONS_TABLE,
  }).promise();
  
  const sendPromises = connections.map(({ connectionId }) => 
    sendNotification(connectionId, data)
  );
  
  await Promise.all(sendPromises);
  
  return { statusCode: 200, body: 'Message sent to all connections' };
}; 