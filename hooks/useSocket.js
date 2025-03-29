import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (challengeId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const socketInstance = io('/', {
      path: '/socket.io',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);

      if (challengeId) {
        socketInstance.emit('join-challenge', challengeId);
      }
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.disconnect();
    };
  }, [challengeId]);

  return { socket, isConnected };
};