import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import roomRoutes from './routes/room.js';
import socketHandler from './sockets/sockets.js';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './db/connect.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(json());
app.use('/api/rooms', roomRoutes);

// Socket.io connection handler
socketHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4000;

// Start server and connect to database
const startServer = async () => {
  try {
    await connect();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the application
startServer();
