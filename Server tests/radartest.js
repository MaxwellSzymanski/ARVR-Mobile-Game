const axios = require('axios');
const https = require('https');
const syncLoop = require('sync-loop');
const numberOfRequests = 10;
const requestPeriod = 5000 // miliseconds between two requests from the same user.

const url = 'https://35.241.198.186:80';
const agent = new https.Agent({
    rejectUnauthorized: false
});

for(let i = 0; i < 60; i++) {
    const name = "username_" + i.toString();
    const email = name + "@testusers.com";
    const password = "password";
    const long = 4.6951758 + 0.000001;
    const lat = 50.864949499969994 + 0.0000005;
    const signin = {
        email : email,
        password : password,
        request : "signin",
        position :
            {
                longitude : long,
                latitude : lat
            }
    };
    axios.post(url, JSON.stringify(signin), { httpsAgent: agent }).then(
        function (json) {

            const radar = {
                request : "radar",
            };
            syncLoop(numberOfRequests, function (loop) {
                // loop body
                var index = loop.iteration(); // index of loop, value from 0 to (numberOfLoop - 1)
                doAsyncJob(function() {
                    setTimeout(function() {
                        axios.post(url, JSON.stringify(radar), {httpsAgent: agent}).then(
                            function() {
                                console.log(name + "|" + index + ":    " + Date.now().toTimeString())
                            }
                        );
                        loop.next(); // call `loop.next()` for next iteration
                    }, requestPeriod)
                })
            }, function () {
                console.log(numberOfRequests + " radar requests were sent.")
            });
        }
    );
}