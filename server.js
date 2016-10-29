'use strict'

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const rooms = require('./rooms.js')

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log('Listening on ', port)
})

app.get('/rooms', rooms.getRooms)

io.on('connection', (socket) => {
    socket.emit('test', 'Connected to web socket')
    console.log('Client Connected')

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
