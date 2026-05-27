const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 60 * 1024 * 1024
});

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = { senders: 0, viewers: 0 };
    if (role === 'viewer') rooms[roomId].viewers++;
    if (role === 'sender') rooms[roomId].senders++;
    io.to(roomId).emit('room-stats', rooms[roomId]);
  });

  socket.on('send-meme', ({ roomId, meme, caption, type, sound, duration }) => {
    socket.to(roomId).emit('receive-meme', { meme, caption, type, sound, duration });
    io.to(roomId).emit('meme-sent', { meme, caption, type, ts: Date.now() });
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms[roomId]) io.to(roomId).emit('room-stats', rooms[roomId]);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
