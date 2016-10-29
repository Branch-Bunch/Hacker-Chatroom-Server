module.exports.getRooms = (req, res) => {
    res.send(io.sockets.adapter.rooms)
})
