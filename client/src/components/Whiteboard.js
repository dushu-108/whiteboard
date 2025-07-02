import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const socket = io(); // assumes same domain

const Whiteboard = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [toolSettings, setToolSettings] = useState({ color: 'black', width: 2 });

  useEffect(() => {
    socket.emit('join-room', roomId);
    socket.on('user-count', setUsers);

    return () => {
      socket.emit('leave-room', roomId);
      socket.off('user-count');
    };
  }, [roomId]);

  return (
    <div className="w-full h-screen flex flex-col">
      <Toolbar toolSettings={toolSettings} setToolSettings={setToolSettings} socket={socket} />
      <DrawingCanvas socket={socket} toolSettings={toolSettings} />
      <UserCursors socket={socket} />
      <div className="absolute bottom-2 left-2 bg-white p-2 text-sm rounded shadow">Users: {users.length}</div>
    </div>
  );
};

export default Whiteboard;
