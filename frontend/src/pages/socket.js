import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
// const fs = require('fs');
const url = require('./serveradress.js');
// const url = "https://localhost:8080";
// const cert = fs.readFileSync('../backend/ssl/team12.pem');
const socketOptions = {
    secure: true,
    rejectUnauthorized: false
};
const socket = openSocket(url, socketOptions);

function signup(userData, that) {
    socket.emit('signup', userData);
    socket.on('signupres', (data) => {
        if (data.success) {
            alert("success");
            const options = {
                path: '/',
                expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
            };
            cookies.set('token', data.token, options);
            cookies.set('name', data.name, options);
            that.setState({redirect: true});
        }
        else alert(data.message);
    });

}

export { signup }