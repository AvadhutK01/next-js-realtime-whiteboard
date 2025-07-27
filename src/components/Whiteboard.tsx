'use client';

import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

type Point = { x: number; y: number };

interface Props {
  boardId: string;
}

let socket: ReturnType<typeof io> | null = null;

export default function Whiteboard({ boardId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const prevPoint = useRef<Point | null>(null);

  useEffect(() => {
    // Connect socket
    socket = io({
      path: '/api/socket_io',
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const getMouse = (e: MouseEvent): Point => ({
      x: e.clientX,
      y: e.clientY,
    });

    const mouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      prevPoint.current = getMouse(e);
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDrawing.current || !prevPoint.current) return;

      const point = getMouse(e);
      drawLine(ctx, prevPoint.current, point);
      socket?.emit('draw', { from: prevPoint.current, to: point }); // emit draw event
      prevPoint.current = point;
    };

    const mouseUp = () => {
      isDrawing.current = false;
      prevPoint.current = null;
    };

    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mouseleave', mouseUp);

    // Receive drawings from others
    socket.on('draw', ({ from, to }: { from: Point; to: Point }) => {
      drawLine(ctx, from, to);
    });

    return () => {
      socket?.disconnect();
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mouseup', mouseUp);
      canvas.removeEventListener('mouseleave', mouseUp);
    };
  }, []);

  const drawLine = (ctx: CanvasRenderingContext2D, p1: Point, p2: Point) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-white cursor-crosshair"
    />
  );
}
