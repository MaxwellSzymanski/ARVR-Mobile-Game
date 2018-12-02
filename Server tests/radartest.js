const axios = require('axios');
const https = require('https');
const fs = require('fs');

const numberOfUsers = 60;
const numberOfRequests = 5;
const requestPeriod = 5000; // miliseconds between two requests from the same user.

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

// const results ={};
const now = new Date();
const dir = './results/' + now.getHours().toString() + now.getMinutes().toString() + now.getSeconds().toString();
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
const PATH = dir + '/all.txt';
const totalstream = fs.createWriteStream(PATH, {flags:'a'});

for(let i = 0; i < numberOfUsers; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    const long = 4.6951758 + 0.001 * Math.random();
    const lat = 50.864949499969994 + 0.001 * Math.random();
    const signin = {
        email: email,
        password: password,
        request: "signin",
        position:
            {
                longitude: long,
                latitude: lat
            }
    };
    // results.i = [];
    const path = dir + '/' + name + ".txt";
    const stream = fs.createWriteStream(path, {flags:'a'});
    setTimeout(function () {
        axios.post(url, JSON.stringify(signin), {httpsAgent: agent}).then(
        function (json) {

            if (!json.data.email || !json.data.password) console.log("\n\n!!!\n\nERROR at user  " + i + "   |   response:  " + json + "\n\n!!!\n\n");
            else {
                const radar = {
                    request: "radar",
                    token: json.data.token,
                    longitude: 4.6951756 + 0.001 * Math.random(),
                    latitude: 50.864949499994123 + 0.001 * Math.random(),
                };
                for (let j = 0; j < numberOfRequests; j++) {
                    setTimeout(function () {
                        const send = new Date();
                        axios.post(url, JSON.stringify(radar), {httpsAgent: agent}).then(
                            function () {
                                const receive = new Date();
                                let milis = receive - send;
                                milis = milis.toString() + "\n";
                                // results.i.push(milis);
                                stream.write(milis);
                                totalstream.write(milis);
                                console.log(name + "|" + j + ":         " + receive.toLocaleTimeString());
                                console.log("                " + milis);
                            }
                        );
                    }, j * requestPeriod);
                }
            }
        });
    // console.log("result_" + i + ":    " + Math.max(results.i));
    }, i * 300);
}
// console.log(results);
