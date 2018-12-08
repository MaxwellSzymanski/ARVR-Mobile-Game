const https = require('https');
const fs = require('fs');
const secret = require('./ssl/https_config.js');

const https_options = {
    key: fs.readFileSync('./ssl/team12.key'),
    passphrase: secret,
    cert: fs.readFileSync('./ssl/team12.pem')
};

const pathRadar = './makeOwnRadar.html';
const pathMap = './testGetPlayers.html';

const port = 80;

https.createServer(https_options, function (req, res) {
    if (req.url === "/map") {
        fs.readFile(pathMap, function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else {
        fs.readFile(pathRadar, function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
}).listen(port);
console.log("Server listening on https://35.241.198.186:" + port);
console.log("Server is responding with " + pathRadar + " on all paths");
console.log("  and with " + pathMap + " on '/map'.");