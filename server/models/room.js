import { Schema, model } from 'mongoose';

const DrawingCommandSchema = new Schema({
  type: String,
  data: Object,
  timestamp: { type: Date, default: Date.now }
});

const RoomSchema = new Schema({
  roomId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  drawingData: [DrawingCommandSchema]
});

export default model('Room', RoomSchema);
