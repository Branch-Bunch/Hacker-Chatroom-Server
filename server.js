'use strict'

const app = require('express')()
const server = require('http').createServer()
const io = require('socket.io')(server)

server.listen(3030, () => {
  console.log('Listening on 3030')
})

io.on('connection', (socket) => {
    socket.emit('test', 'Are you reading this?')
    console.log('CONNECTED', socket)
})
