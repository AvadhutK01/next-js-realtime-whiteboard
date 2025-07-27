import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as SocketServerType } from 'socket.io';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketServerType;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data); // Send to all other clients
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
