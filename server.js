'use strict';

const server = require('http').createServer();
const p2pserver = require('socket.io-p2p-server').Server
const io = require('socket.io')(server);

server.listen(3030, () => {
  console.log('Listening on 3030');
});

io.use(p2pserver);

io.on('connection', (socket) => {
  socket.on('peer-msg', (data) => {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  });

  socket.on('peer-file', (data) => {
    console.log('File from peer: %s', data);
    socket.broadcast.emit('peer-file', data);
  });

  socket.on('go-private', (data) => {
    socket.broadcast.emit('go-private', data);
  });
});
