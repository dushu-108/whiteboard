import React from 'react';

const colors = ['black', 'red', 'blue', 'green'];

const Toolbar = ({ toolSettings, setToolSettings, socket }) => {
  return (
    <div className="flex items-center p-2 bg-white border-b shadow">
      <label className="mr-4">Color:</label>
      {colors.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 mr-2 rounded-full ${toolSettings.color === color ? 'ring-2 ring-gray-500' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => setToolSettings({ ...toolSettings, color })}
        />
      ))}
      <label className="ml-4 mr-2">Width:</label>
      <input
        type="range"
        min="1"
        max="10"
        value={toolSettings.width}
        onChange={(e) => setToolSettings({ ...toolSettings, width: parseInt(e.target.value) })}
      />
      <button
        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => socket.emit('clear-canvas')}
      >
        Clear
      </button>
    </div>
  );
};

export default Toolbar;
