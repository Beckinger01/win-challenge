// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });
  
  // Initialize Socket.io
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    
    // Join a challenge room
    socket.on('join-challenge', (challengeId) => {
      socket.join(`challenge-${challengeId}`);
      console.log(`Socket ${socket.id} joined challenge-${challengeId}`);
    });
    
    // Challenge timer events
    socket.on('update-challenge', ({ challengeId, challengeData }) => {
      io.to(`challenge-${challengeId}`).emit('challenge-updated', challengeData);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  // Make io accessible globally
  global.io = io;
  
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});