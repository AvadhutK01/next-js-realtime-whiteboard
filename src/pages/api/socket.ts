import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as SocketServerType } from 'socket.io';
import { connectToDatabase } from '@/lib/db';
import { Drawing } from '@/models/Drawing';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketServerType;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log('Initializing new Socket.io server...');
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('draw', async (data: { from: { x: number; y: number }; to: { x: number; y: number }; boardId: string }) => {
        const { from, to, boardId } = data;

        socket.broadcast.emit('draw', { from, to });

        try {
          await connectToDatabase();
          await Drawing.create({ from, to, boardId });
        } catch (error) {
          console.error('Failed to save drawing to DB:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  res.end();
}
