import React, { useRef, useEffect } from 'react';

const DrawingCanvas = ({ socket, toolSettings }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60; // minus toolbar height
    canvas.style.background = 'white';

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    socket.on('draw-start', ({ x, y, color, width }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    socket.on('draw-move', ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.on('clear-canvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('clear-canvas');
    };
  }, [socket]);

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getXY(e);
    drawing.current = true;
    ctxRef.current.strokeStyle = toolSettings.color;
    ctxRef.current.lineWidth = toolSettings.width;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    socket.emit('draw-start', { x, y, ...toolSettings });
  };

  const handleMouseMove = (e) => {
    if (!drawing.current) return;
    const { x, y } = getXY(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    socket.emit('draw-move', { x, y });
    socket.emit('cursor-move', { x, y });
  };

  const handleMouseUp = () => {
    drawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default DrawingCanvas;
