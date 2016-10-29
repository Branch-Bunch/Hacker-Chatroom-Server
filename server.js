'use strict'

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log('Listening on ', port)
})

app.get('/rooms', (req, res) => {
    res.send(getRooms())
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

function getRooms() {
    const rooms = io.sockets.adapter.rooms
    let chatRoom = Object.keys(rooms)
        .filter(room => Object.keys(rooms[room].sockets)[0] !== room)

    if (chatRoom.length === 0) {
        io.emit('create', 'Default Room')
        chatRoom = Object.keys(rooms)
            .filter(room => Object.keys(rooms[room].sockets)[0] !== room)
    }
    return chatRoom
}
