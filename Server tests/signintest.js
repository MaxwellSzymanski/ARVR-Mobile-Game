const axios = require('axios');
const https = require('https');

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

for(let i = 0; i < 60; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    const data = {
        email : email,
        password : password,
        request : "signin",
        position :
            {
                longitude : 4.6951758,
                latitude : 50.864949499969994
            }
    };
    axios.post(url, JSON.stringify(data), { httpsAgent: agent });
}