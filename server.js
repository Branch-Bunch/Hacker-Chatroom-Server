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
    const chatRooms = Object.keys(rooms)
        .filter(room => Object.keys(rooms[room].sockets)[0] !== room)
        .map(room => ({ name: room, size: rooms[room].length }))

    res.send(chatRooms)
})

io.on('connection', (socket) => {
    console.log('Client Connected')
 
    socket.on('chat', (message) => {
        const room = filterRooms(socket)
        notifyRoom(room, 'chat', message)
        console.log(message)
    })

    socket.on('private', (sender, message) => {
        // private message received
    })
    
    socket.on('leave-room', (name) => {
        const room = filterRooms(socket)
        const message = `${getTime()} - ${name} has disconnected`
        socket.broadcast.to(room).emit('leave-room', message)
        console.log(`${message} from ${room}`)

        socket.leave(room, (err) => {
            if (err) {
                console.log(err)
            }
        })
    })

    socket.on('join-room', (room, name) => {
        socket.join(room)
        const message =  `${getTime()} - ${name} has connected`
        socket.broadcast.to(room).emit('join-room', message)
        console.log(`${message} to ${room}`)
    })
})

function notifyRoom(room, event, message) {
    io.to(room).emit(event, message)
}

function filterRooms(socket) { 
    return Object.keys(socket.rooms)
        .filter(x => x !== socket.id)[0]
} 

function getTime() {
    const d = new Date()
    const pad = d.getMinutes() < 10 ? '0' : ''
    return `${d.getHours()}:${pad}${d.getMinutes()}`
}
