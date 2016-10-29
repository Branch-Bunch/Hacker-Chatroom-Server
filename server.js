'use strict'

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log('Listening on ', port)
})

app.get('/rooms', (req, res) => {
    const roomKeys = io.sockets.adapter.rooms
    res.send(io.sockets.clients())
})

io.on('connection', (socket) => {
    socket.emit('test', 'Connected to web socket')
    console.log('Client Connected')
    socket.emit('setname', 'Enter username: ')
    socket.emit('sendmessage', '')
    socket.on('general', (msg) => {
        io.emit('general', msg)
        console.log(msg)
    })

    socket.on('private', (sender, msg) => {
        // private message received
    })

    socket.on('disconnect', () => {
        io.emit('client disconnected')
    })

    socket.on('create', (room) => {
        socket.join(room)
    })
})
