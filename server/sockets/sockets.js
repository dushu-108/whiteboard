import Room from '../models/room.js';

export default (io) => {
  const usersInRoom = {};

  io.on('connection', (socket) => {
    socket.on('join-room', async (roomId) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = socket.id;

      usersInRoom[roomId] = usersInRoom[roomId] || new Set();
      usersInRoom[roomId].add(socket.id);

      io.to(roomId).emit('user-count', Array.from(usersInRoom[roomId]));

      socket.on('cursor-move', ({ x, y }) => {
        socket.to(roomId).emit('cursor-move', { x, y, userId: socket.id });
      });

      socket.on('draw-start', (data) => {
        io.to(roomId).emit('draw-start', data);
        Room.updateOne({ roomId }, {
          $push: { drawingData: { type: 'stroke', data, timestamp: new Date() } },
          $set: { lastActivity: new Date() }
        }).exec();
      });

      socket.on('draw-move', (data) => {
        io.to(roomId).emit('draw-move', data);
      });

      socket.on('clear-canvas', () => {
        io.to(roomId).emit('clear-canvas');
        Room.updateOne({ roomId }, {
          $push: { drawingData: { type: 'clear', timestamp: new Date() } },
          $set: { lastActivity: new Date() }
        }).exec();
      });

      socket.on('disconnect', () => {
        const users = usersInRoom[roomId];
        if (users) {
          users.delete(socket.id);
          if (users.size === 0) delete usersInRoom[roomId];
          else io.to(roomId).emit('user-count', Array.from(users));
        }
      });
    });
  });
};
