import { WebSocketServer, WebSocket } from 'ws';
import url from 'url';

// Store active connections by user
const connections = {};

// Initialize WebSocket server
export const initWebSocketServer = (server) => {
    const wss = new WebSocketServer({ 
        noServer: true,
        path: '/api/notifications/ws'
    });
    
    // Handle upgrade
    server.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
        
        if (pathname.startsWith('/api/notifications/ws')) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        }
    });
    
    // Connection handler
    wss.on('connection', (ws, request) => {
        const pathname = url.parse(request.url).pathname;
        const pathParts = pathname.split('/');
        
        // Extract user ID from URL path
        // Format: /api/notifications/ws/:userId
        const userId = pathParts[4];
        const userType = url.parse(request.url, true).query.userType || 'vendor';
        
        console.log(`WebSocket: New connection established for ${userType} ${userId}`);
        
        // Store the connection
        if (!connections[userId]) {
            connections[userId] = [];
        }
        
        connections[userId].push({
            ws,
            userType
        });
        
        // Connection established message
        ws.send(JSON.stringify({
            type: 'connection',
            message: 'WebSocket connection established',
            userId,
            userType
        }));
        
        // Handle incoming messages
        ws.on('message', (message) => {
            console.log(`WebSocket: Received message from ${userType} ${userId}: ${message}`);
            
            try {
                const data = JSON.parse(message);
                
                // Handle different message types
                if (data.type === 'ping') {
                    // Respond to ping with pong
                    ws.send(JSON.stringify({
                        type: 'pong',
                        timestamp: new Date().toISOString()
                    }));
                }
            } catch (error) {
                console.error('WebSocket: Error parsing message:', error);
            }
        });
        
        // Handle connection close
        ws.on('close', () => {
            console.log(`WebSocket: Connection closed for ${userType} ${userId}`);
            
            // Remove the connection
            if (connections[userId]) {
                const index = connections[userId].findIndex(conn => conn.ws === ws);
                if (index !== -1) {
                    connections[userId].splice(index, 1);
                }
                
                // Remove the user if no more connections
                if (connections[userId].length === 0) {
                    delete connections[userId];
                }
            }
        });
        
        // Handle errors
        ws.on('error', (error) => {
            console.error(`WebSocket: Error for ${userType} ${userId}:`, error);
        });
    });
    
    // Return the WebSocket server
    return wss;
};

// Send notification to a specific user
export const sendNotification = (userId, notification) => {
    console.log(`WebSocket: Sending notification to user ${userId}:`, notification);
    
    if (connections[userId]) {
        connections[userId].forEach(connection => {
            if (connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'notification',
                    notification
                }));
            }
        });
    } else {
        console.log(`WebSocket: No active connections for user ${userId}`);
    }
};

// Send lead to a specific vendor
export const sendLeadNotification = (vendorId, lead) => {
    console.log(`WebSocket: Sending lead notification to vendor ${vendorId}:`, lead);
    
    if (connections[vendorId]) {
        connections[vendorId].forEach(connection => {
            if (connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'lead',
                    lead
                }));
            }
        });
    } else {
        console.log(`WebSocket: No active connections for vendor ${vendorId}`);
    }
};

// Get active connection count
export const getActiveConnectionCount = () => {
    let count = 0;
    Object.values(connections).forEach(userConnections => {
        count += userConnections.length;
    });
    return count;
};

// Helper to send broadcast to all connections
export const broadcastMessage = (message) => {
    console.log(`WebSocket: Broadcasting message to all connections:`, message);
    
    Object.values(connections).forEach(userConnections => {
        userConnections.forEach(connection => {
            if (connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify(message));
            }
        });
    });
}; 