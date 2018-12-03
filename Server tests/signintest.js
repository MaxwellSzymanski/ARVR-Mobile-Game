const axios = require('axios');
const https = require('https');
const numberOfUsers = 10;

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

for(let i = 0; i < numberOfUsers; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    const long = 4.6951758 + 0.01 * Math.random();
    const lat = 50.864949499969994 + 0.01 * Math.random();
    const data = {
        email : email,
        password : password,
        request : "signin",
        position :
            {
                longitude : long,
                latitude : lat
            }
    };
    axios.post(url, JSON.stringify(data), { httpsAgent: agent });
}

console.log(numberOfUsers + " signin requests sent.");