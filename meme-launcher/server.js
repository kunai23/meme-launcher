const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 60 * 1024 * 1024 });

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {}; // roomId -> { users: { socketId: { name, role } } }

function broadcastUsers(roomId) {
  if (!rooms[roomId]) return;
  const users = Object.entries(rooms[roomId].users).map(([id, u]) => ({ id, name: u.name, role: u.role }));
  io.to(roomId).emit('room-users', users);
}

io.on('connection', (socket) => {

  socket.on('join-room', ({ roomId, role, name }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.name = name || 'Anonyme';
    socket.data.role = role;

    if (!rooms[roomId]) rooms[roomId] = { users: {} };
    rooms[roomId].users[socket.id] = { name: name || 'Anonyme', role };

    broadcastUsers(roomId);
    console.log(`[${role}] ${name} a rejoint ${roomId}`);
  });

  socket.on('set-name', ({ name }) => {
    const roomId = socket.data.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId].users[socket.id].name = name;
      socket.data.name = name;
      broadcastUsers(roomId);
    }
  });

  socket.on('send-meme', ({ roomId, meme, caption, type, sound, duration, senderName, position, volume, targets }) => {
    // targets = array of socket IDs to send to (everyone except sender if empty)
    if (targets && targets.length > 0) {
      targets.forEach(targetId => {
        io.to(targetId).emit('receive-meme', { meme, caption, type, sound, duration, senderName, position, volume });
      });
    } else {
      socket.to(roomId).emit('receive-meme', { meme, caption, type, sound, duration, senderName, position, volume });
    }
    socket.emit('meme-sent', { ts: Date.now() });
  });

  socket.on('stop-meme', ({ roomId, targets }) => {
    if (targets && targets.length > 0) {
      targets.forEach(targetId => io.to(targetId).emit('stop-meme'));
    } else {
      socket.to(roomId).emit('stop-meme');
    }
  });

  socket.on('disconnecting', () => {
    const roomId = socket.data.roomId;
    if (roomId && rooms[roomId]) {
      delete rooms[roomId].users[socket.id];
      broadcastUsers(roomId);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
