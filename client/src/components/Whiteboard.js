import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const Whiteboard = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [toolSettings, setToolSettings] = useState({ 
    color: 'black', 
    width: 3 
  });

  // Initialize socket connection with useMemo to prevent reconnection on re-renders
  const socket = useMemo(() => {
    const socketInstance = io('http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      forceNew: true,
      timeout: 20000
    });

    // Add debug event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return socketInstance;
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.emit('join-room', roomId);
    
    // Handle user count updates
    const handleUserCount = (userList) => {
      setUsers(userList);
    };
    
    socket.on('user-count', handleUserCount);
  
    // Cleanup on unmount or when roomId/socket changes
    return () => {
      socket.off('user-count', handleUserCount);
      if (roomId) {
        socket.emit('leave-room', roomId);
      }
    };
  }, [roomId, socket]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <Toolbar 
        toolSettings={toolSettings} 
        setToolSettings={setToolSettings} 
        socket={socket}
        userCount={users.length}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <DrawingCanvas 
          socket={socket} 
          toolSettings={toolSettings} 
        />
        <UserCursors 
          socket={socket} 
          currentUsers={users} 
        />
      </div>
      
      {/* Room indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-full text-sm text-gray-600 shadow-md border border-gray-200">
        Room: <span className="font-mono font-semibold">{roomId}</span>
      </div>
    </div>
  );
};

export default Whiteboard;
