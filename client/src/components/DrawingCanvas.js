import React, { useRef, useEffect, useCallback } from 'react';

const DrawingCanvas = ({ socket, toolSettings }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const canvasSize = useRef({ width: 0, height: 0 });

  // Function to clear the canvas
  const clearCanvas = useCallback(() => {
    if (ctxRef.current) {
      const canvas = canvasRef.current;
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Set canvas size
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - 60; // minus toolbar height
      canvas.width = width;
      canvas.height = height;
      canvasSize.current = { width, height };
    };

    // Initial setup
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Initialize context
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = toolSettings.color;
    ctx.lineWidth = toolSettings.width;
    ctxRef.current = ctx;

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Update context when tool settings change
  useEffect(() => {
    if (!ctxRef.current) return;
    
    ctxRef.current.strokeStyle = toolSettings.color;
    ctxRef.current.lineWidth = toolSettings.width;
  }, [toolSettings.color, toolSettings.width]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Handle drawing events
    const handleDrawStart = ({ x, y, color, width }) => {
      if (!ctxRef.current) return;
      const currentCtx = ctxRef.current;
      currentCtx.beginPath();
      currentCtx.strokeStyle = color || toolSettings.color;
      currentCtx.lineWidth = width || toolSettings.width;
      currentCtx.moveTo(x, y);
    };

    const handleDrawMove = ({ x, y }) => {
      if (drawing.current && ctxRef.current) {
        const currentCtx = ctxRef.current;
        currentCtx.lineTo(x, y);
        currentCtx.stroke();
      }
    };

    // Set up socket listeners with error handling
    const setupSocketListeners = () => {
      try {
        socket.on('draw-start', handleDrawStart);
        socket.on('draw-move', handleDrawMove);
        socket.on('clear-canvas', clearCanvas);
      } catch (error) {
        console.error('Error setting up socket listeners:', error);
      }
    };

    setupSocketListeners();

    // Clean up
    return () => {
      try {
        socket.off('draw-start', handleDrawStart);
        socket.off('draw-move', handleDrawMove);
        socket.off('clear-canvas', clearCanvas);
      } catch (error) {
        console.error('Error cleaning up socket listeners:', error);
      }
    };
  }, [socket, clearCanvas, toolSettings]);

  // Add debug logging for socket events
  useEffect(() => {
    const handleClearCanvas = () => {
      console.log('Clear canvas event received');
      clearCanvas();
    };

    socket.on('clear-canvas', handleClearCanvas);
    return () => {
      socket.off('clear-canvas', handleClearCanvas);
    };
  }, [socket, clearCanvas]);

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
