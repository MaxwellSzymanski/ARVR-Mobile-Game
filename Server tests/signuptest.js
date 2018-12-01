const axios = require('axios');
const fs = require('fs');
const https = require('https');
const numberOfUsers = 60;

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

for(let i = 0; i < numberOfUsers; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    let image = fs.readFileSync('./image.png');
    image = new Buffer(image).toString('base64');
    const data = {
        name : name,
        email : email,
        password : password,
        image : image,
        request : "signup"
    };
    setTimeout(function () {
        axios.post(url, JSON.stringify(data), { httpsAgent: agent });
    }, i * 200);
}