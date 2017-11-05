'use strict';

module.exports = io => {
    io.on('connection', socket => {
        console.log('user connected');
        socket.on('chat message', msg => {
            console.log(msg);
            io.emit('chat message', "recibido")
        })
    })
}