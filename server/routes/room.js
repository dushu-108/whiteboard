import { Router } from 'express';
const router = Router();
import Room from '../models/room.js';

router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  let room = await Room.findOne({ roomId });

  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }

  res.json({ success: true, roomId });
});

router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

export default router;
