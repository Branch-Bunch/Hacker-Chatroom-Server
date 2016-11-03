'use strict'

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log('Listening on ', port)
})

app.get('/rooms', (req, res) => {
    const rooms = io.sockets.adapter.rooms
    console.log(io.sockets.adapter.rooms)

    const chatRooms = Object.keys(rooms)
        .filter(room => Object.keys(rooms[room].sockets)[0] !== room)
        .map(room => ({ name: room, size: rooms[room].length }))

    res.send(chatRooms)
})

io.on('connection', (socket) => {
    console.log('Client Connected')

    socket.on('chat', (message) => {
        const room = filterRooms(socket)

        io.to(room[0]).emit('chat', message)
        console.log(message)
    })

    socket.on('private', (sender, message) => {
        // private message received
    })

    socket.on('user-disconnect', (name) => {
        const room = filterRooms(socket)
        const message = name + ' has disconnected'
        io.to(room[0]).emit('user-disconnect', message)
        console.log(message)
    })

    socket.on('create', (room) => {
        socket.join(room)
    })
})

function filterRooms(socket) { 
    return Object.keys(socket.rooms)
        .filter(x => x !== socket.id)
} 
