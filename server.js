'use strict'

const app = require('express')()
const server = require('http').createServer()
const io = require('socket.io')(server)

server.listen(3030, () => {
  console.log('Listening on 3030')
})

io.on('connection', (socket) => {
    socket.emit('test', 'client connected')
    //console.log('CONNECTED', socket)
	socket.on('general', (msg) => {
		io.emit('general', msg)
	})

	socket.on('disconnect', () => {
		io.emit('client disconnected')
	})

  	socket.on('create', function(room) {
    	socket.join(room);
  	});

})
