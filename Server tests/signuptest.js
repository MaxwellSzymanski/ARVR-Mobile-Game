const axios = require('axios');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

for(let i = 0; i < 2; i++) {
    // let id = i.toString();
    // id = id.concat(id, id, id, id, id, id, id, id, id, id, id);
    // id = new mongoose.mongo.ObjectId(id);
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    let image = fs.readFileSync('./image.png');
    image = new Buffer(image).toString('base64');
    const data = {
        // _id: id,
        name : name,
        email : email,
        password : password,
        image : image,
        request : "signup"
    };
    axios.post(url, JSON.stringify(data), { httpsAgent: agent });
}