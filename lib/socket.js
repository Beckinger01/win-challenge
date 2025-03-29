import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server);

    io.on('connection', (socket) => {
      console.log('A client connected:', socket.id);

      socket.on('join-challenge', (challengeId) => {
        socket.join(`challenge-${challengeId}`);
        console.log(`Socket ${socket.id} joined challenge-${challengeId}`);
      });

      socket.on('start-challenge-timer', (challengeId) => {
        io.to(`challenge-${challengeId}`).emit('challenge-timer-started');
      });

      socket.on('pause-challenge-timer', (challengeId) => {
        io.to(`challenge-${challengeId}`).emit('challenge-timer-paused');
      });

      socket.on('stop-challenge-timer', (challengeId) => {
        io.to(`challenge-${challengeId}`).emit('challenge-timer-stopped');
      });

      socket.on('start-game-timer', ({ challengeId, gameIndex }) => {
        io.to(`challenge-${challengeId}`).emit('game-timer-started', gameIndex);
      });

      socket.on('pause-game-timer', ({ challengeId, gameIndex }) => {
        io.to(`challenge-${challengeId}`).emit('game-timer-paused', gameIndex);
      });

      socket.on('stop-game-timer', ({ challengeId, gameIndex }) => {
        io.to(`challenge-${challengeId}`).emit('game-timer-stopped', gameIndex);
      });

      socket.on('increase-win-count', ({ challengeId, gameIndex }) => {
        io.to(`challenge-${challengeId}`).emit('win-count-increased', gameIndex);
      });

      socket.on('update-challenge', ({ challengeId, challengeData }) => {
        io.to(`challenge-${challengeId}`).emit('challenge-updated', challengeData);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}