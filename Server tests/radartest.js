const axios = require('axios');
const https = require('https');
const numberOfUsers = 60;
const numberOfRequests = 5;
const requestPeriod = 2500; // miliseconds between two requests from the same user.

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

const results ={};

for(let i = 0; i < numberOfUsers; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    const long = 4.6951758 + 0.0001 * Math.random();
    const lat = 50.864949499969994 + 0.0001 * Math.random();
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
    results.i = [];
    setTimeout(function () {
        axios.post(url, JSON.stringify(signin), {httpsAgent: agent}).then(
        function (json) {

            if (!json.data.email || !json.data.password) console.log("\n\n!!!\n\nERROR at user  " + i + "   |   response:  " + json + "\n\n!!!\n\n");
            else {
                const radar = {
                    request: "radar",
                    token: json.data.token,
                    longitude: 4.6951758 + 0.0001 * Math.random(),
                    latitude: 50.864949499969994 + 0.0001 * Math.random(),
                };
                for (let j = 0; j < numberOfRequests; j++) {
                    setTimeout(function () {
                        const send = new Date();
                        axios.post(url, JSON.stringify(radar), {httpsAgent: agent}).then(
                            function () {
                                const recieve = new Date();
                                const milis = recieve - send;
                                results.i.push(milis);
                                console.log(name + "|" + j + ":         " + new Date().toLocaleTimeString());
                                console.log("                " + milis + "\n");
                            }
                        );
                    }, j * requestPeriod);
                }
            }
        });
    console.log("result_" + i + ":    " + (results.i).toString());
    }, i * 200);
}