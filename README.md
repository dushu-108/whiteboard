# Real-time Collaborative Whiteboard

A real-time collaborative whiteboard application built with MERN stack and Socket.IO, allowing multiple users to draw simultaneously in the same room.

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Architecture Overview](#architecture-overview)
- [Deployment Guide](#deployment-guide)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whiteboard.git
   cd whiteboard
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and other configurations
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Update .env with your server URL (default: http://localhost:4000)
   ```

4. **Start the development servers**
   - In one terminal (server):
     ```bash
     cd server
     npm run dev
     ```
   - In another terminal (client):
     ```bash
     cd client
     npm start
     ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### REST API Endpoints

#### Rooms
- `POST /api/rooms/join` - Join or create a room
  - Request body: `{ "roomId": "string" }`
  - Response: `{ "success": boolean, "roomId": "string" }`

- `GET /api/rooms/:roomId` - Get room details
  - Response: Room object

### Socket.IO Events

#### Client to Server
- `join-room` - Join a room
  - Data: `{ roomId: string }`

- `draw-start` - Start drawing
  - Data: `{ x: number, y: number, color: string, width: number }`

- `draw-move` - Continue drawing
  - Data: `{ x: number, y: number }`

- `clear-canvas` - Clear the canvas
  - Data: None

- `cursor-move` - Update cursor position
  - Data: `{ x: number, y: number }`

- `leave-room` - Leave the current room
  - Data: `{ roomId: string }`

#### Server to Client
- `user-count` - Update user count in room
  - Data: `Array<userId>`

- `draw-start` - Start drawing (broadcast)
  - Data: `{ x: number, y: number, color: string, width: number, userId: string }`

- `draw-move` - Continue drawing (broadcast)
  - Data: `{ x: number, y: number, userId: string }`

- `clear-canvas` - Canvas cleared (broadcast)
  - Data: None

- `cursor-move` - Cursor position update (broadcast)
  - Data: `{ x: number, y: number, userId: string }`

## Architecture Overview

### Frontend (React)
- **Components**:
  - `Whiteboard`: Main container component
  - `DrawingCanvas`: Handles drawing functionality
  - `Toolbar`: Drawing tools and options
  - `UserCursors`: Displays other users' cursors
  - `RoomJoin`: Room entry point

- **State Management**:
  - React hooks for local state
  - Context API for global state (if needed)
  - Socket.IO client for real-time communication

### Backend (Node.js + Express)
- **Routes**:
  - Room management
  - User authentication (if implemented)

- **Socket.IO**:
  - Real-time event handling
  - Room-based broadcasting
  - User presence tracking

### Database (MongoDB)
- **Collections**:
  - `rooms`: Stores room data and drawing history
  - `users`: User data (if authentication is added)

## Deployment Guide

### Prerequisites
- Production server (e.g., AWS, DigitalOcean, Heroku)
- MongoDB Atlas or self-hosted MongoDB
- Domain name (optional)
- SSL certificate (recommended)

### Backend Deployment

1. **Set environment variables**
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   CORS_ORIGIN=your_frontend_url
   ```

2. **Build and start the server**
   ```bash
   npm install
   npm run build
   npm start
   ```

3. **Using PM2 (recommended for production)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "whiteboard-server"
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Update environment variables**
   ```env
   REACT_APP_API_URL=your_backend_url
   ```

2. **Build the application**
   ```bash
   npm install
   npm run build
   ```

3. **Serve the static files**
   - Using serve:
     ```bash
     npm install -g serve
     serve -s build -l 3000
     ```
   - Or configure your web server (Nginx, Apache) to serve the `build` directory

### Using Docker (Optional)

1. **Build the Docker image**
   ```bash
   docker build -t whiteboard .
   ```

2. **Run the container**
   ```bash
   docker run -p 4000:4000 -e MONGODB_URI=your_mongodb_uri whiteboard
   ```

### Monitoring and Maintenance
- Set up logging (e.g., Winston + ELK stack)
- Configure monitoring (e.g., PM2 monitoring, New Relic)
- Set up automated backups for MongoDB
- Implement CI/CD pipeline for automated deployments

## License
[MIT](https://choosealicense.com/licenses/mit/)
