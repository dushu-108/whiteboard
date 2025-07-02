import React from 'react';
import { FaEraser, FaPalette, FaArrowsAlt } from 'react-icons/fa';

const colors = [
  { value: 'black', name: 'Black' },
  { value: 'red', name: 'Red' },
  { value: 'blue', name: 'Blue' },
  { value: 'green', name: 'Green' }
];

const Toolbar = ({ toolSettings, setToolSettings, socket, userCount }) => {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This will clear for all users in the room.')) {
      socket.emit('clear-canvas');
    }
  };

  return (
    <div className="flex items-center p-2 bg-white border-b shadow-md">
      <div className="flex items-center mr-6">
        <FaPalette className="text-gray-600 mr-2" />
        <span className="text-sm text-gray-600 mr-3">Color:</span>
        <div className="flex space-x-2">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`w-6 h-6 rounded-full transform transition-transform hover:scale-110 ${
                toolSettings.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setToolSettings({ ...toolSettings, color: color.value })}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center mr-6">
        <span className="text-sm text-gray-600 mr-2">Width:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={toolSettings.width}
          onChange={(e) => setToolSettings({ ...toolSettings, width: parseInt(e.target.value) })}
          className="w-24"
        />
        <span className="ml-2 text-xs text-gray-500 w-4 text-center">{toolSettings.width}</span>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleClear}
          className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors border border-red-200"
          title="Clear canvas"
        >
          <FaEraser className="mr-1.5" />
          Clear Canvas
        </button>
      </div>

      <div className="ml-auto flex items-center text-sm text-gray-600">
        <FaArrowsAlt className="mr-1.5" />
        <span>{userCount} {userCount === 1 ? 'user' : 'users'} in room</span>
      </div>
    </div>
  );
};

export default Toolbar;
