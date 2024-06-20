const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const socket = require('socket.io');
const http = require('http');

app.use(cors());
// Je démarre un serveur HTTP, dans lequel je lance un serveur socket.io
// On utilise cors pour ne pas avoir d'erreurs Cross Origin Request (ici on est censé accepter uniquement l'url du front)
const server = http.createServer(app);
const io = socket(server, {
  cors: {origin: 'http://localhost:5173'}
})
// Une fois le serveur sockets.io démarré, on va pouvoir créer différents évènements qui seront déclenchés par le front.
// Le premier évènement est l'évènement de connexion, c'est ici ou l'on feras la grosse partie du code
let socketsConnected = new Set();
let users = {};

// On crée un évènement sur le serveur, lorsque un user est connecté, on console log, on rajoute son id dans un tableau.
// Et on peut créer différents évènements
io.on('connection', (socket) => {
  console.log(`New user connected : ${socket.id}`);
  socketsConnected.add(socket.id);

  // Je transmet au front le nombre de sockets connectés au serveur
  io.emit('userCount', socketsConnected.size);

  socket.on('message', (message) => {
    io.emit('message', message);
  })

  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  })

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  })

  // Je retransmet a tout le monde, lorsqu'un user individuel setUsername
  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    io.emit('updateUserList', users);
  });

  // Nous allons gérer la déconnexion des users :
  socket.on('disconnect', () => {
    console.log(`User disconnected : ${socket.id}`);
    socketsConnected.delete(socket.id);
    delete users[socket.id];
    io.emit('updateUserList', users);
    io.emit('userCount', socketsConnected.size);
  })

})

app.get('/', (req,res) => {
  res.send('Hello, welcome to my server');
})

server.listen(port, () => {
  console.log(`Server online on port http://localhost:${port}`);
})