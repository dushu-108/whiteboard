import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignInAlt, FaTimes, FaPencilAlt } from 'react-icons/fa';

const RoomJoin = () => {
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await axios.post('http://localhost:4000/api/rooms/join', { roomId });
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError('Failed to join room. Please try again.');
      console.error('Error joining room:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRoomId('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-center mb-2">
            <FaPencilAlt className="text-3xl mr-3" />
            <h1 className="text-2xl font-bold">Whiteboard App</h1>
          </div>
          <p className="text-center text-blue-100">Collaborate in real-time with your team</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Room Code
            </label>
            <div className="relative">
              <input
                id="roomId"
                type="text"
                placeholder="e.g., my-cool-room-123"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              />
              {roomId && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear input"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {isLoading ? (
              'Joining...'
            ) : (
              <>
                <FaSignInAlt className="mr-2" />
                Join Room
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have a room code? Just enter a name and we'll create one for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;
