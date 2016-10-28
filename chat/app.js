'use strict';

const P2P = require('socket.io-p2p');
const io = require('socket.io-client');
const socket = io();

const p2p = new P2P(socket);

p2p.on('ready', function(){
    p2p.usePeerConnection = true;
    p2p.emit('peer-obj', { peerId: peerId });
})

// this event will be triggered over the socket transport 
// until `usePeerConnection` is set to `true`
p2p.on('peer-msg', function(data){
    console.log(data);
});
