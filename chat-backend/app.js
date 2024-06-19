const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");

app.use(cors());
const server = http.createServer(app);
const io = socket(server, {
    cors: {origin: 'http://localhost:5173'}
    });

let socketConnected = new Set();
let users = {};

io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id} `);
    socketConnected.add(socket.id);

    io.emit('userCount', socketConnected.size);
    console.log(socketConnected.size);

    socket.on('setUserName', (userName) => {
        users[socket.id] = userName;
        io.emit('updateUserList', users);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        socketConnected.delete(socket.id);
        delete users[socket.id];
        io.emit('updateUserList', users);
        io.emit('userCount', socketConnected.size);
        console.log(socketConnected.size);
    })
});
app.get("/", (req, res) => {
    res.send("Hello welcome to my server!");
})
server.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})