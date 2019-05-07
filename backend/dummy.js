const https = require('https');
const fs = require('fs');
const secret = require('./ssl/https_config.js');

const https_options = {
    key: fs.readFileSync('./ssl/team12.key'),
    passphrase: secret,
    cert: fs.readFileSync('./ssl/team12.pem')
};

const dummy = './dummy.html';

const port = 82;

https.createServer(https_options, function (req, res) {
    fs.readFile(dummy, function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}).listen(port);
console.log("Server listening on https://35.241.198.186:" + port);
console.log("Server is responding with " + dummy + " on all paths");