io = require('socket.io-client');

var socket = io.openSocket('https://localhost:8080');

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8000');
//
// function subscribeToTimer(cb) {
//     socket.on('timer', timestamp => cb(null, timestamp));
//     socket.emit('subscribeToTimer', 1000);
// }
//
// export { subscribeToTimer }