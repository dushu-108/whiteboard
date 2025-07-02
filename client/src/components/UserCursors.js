import React, { useEffect, useState } from 'react';

const UserCursors = ({ socket }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    socket.on('cursor-move', ({ x, y, userId }) => {
      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y, lastUpdated: Date.now() },
      }));
    });

    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([_, val]) => now - val.lastUpdated < 3000)
        )
      );
    }, 3000);

    return () => {
      socket.off('cursor-move');
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y }]) => (
        <div
          key={id}
          className="absolute z-50 pointer-events-none"
          style={{ left: x + 5, top: y + 5 }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full opacity-75" />
        </div>
      ))}
    </>
  );
};

export default UserCursors;
