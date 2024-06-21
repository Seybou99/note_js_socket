const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const socket = require('socket.io');
const http = require('http');

app.use(cors());

const server = http.createServer(app);
const io = socket(server, {
  cors: { origin: 'http://localhost:5173' }
});

let socketsConnected = new Set();
let users = {};

io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);
  socketsConnected.add(socket.id);

  io.emit('userCount', socketsConnected.size);

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('privateMessage', (message) => {
    const recipientSocket = io.sockets.sockets.get(message.recipientId);
    if (recipientSocket) {
      recipientSocket.emit('message', message);
      socket.emit('message', message);  // Also emit to sender
    }
  });

  socket.on('typing', (user) => {
    if (user.recipientId === 'All') {
      socket.broadcast.emit('typing', user);
    } else {
      const recipientSocket = io.sockets.sockets.get(user.recipientId);
      if (recipientSocket) {
        recipientSocket.emit('typing', user);
      }
    }
  });

  socket.on('stopTyping', (recipientId) => {
    if (recipientId === 'All') {
      socket.broadcast.emit('stopTyping');
    } else {
      const recipientSocket = io.sockets.sockets.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit('stopTyping');
      }
    }
  });

  socket.on('setUsername', (username) => {
    users[socket.id] = { username, isConnected: true };
    io.emit('updateUserList', users);
  });

  socket.on('messageSeen', (messageId) => {
    io.emit('messageSeen', { messageId, userId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (users[socket.id]) {
      users[socket.id].isConnected = false;
    }
    socketsConnected.delete(socket.id);
    io.emit('updateUserList', users);
    io.emit('userCount', socketsConnected.size);
  });
});

app.get('/', (req, res) => {
  res.send('Hello, welcome to my server');
});

server.listen(port, () => {
  console.log(`Server online on port http://localhost:${port}`);
});
