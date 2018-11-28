var https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = require('./db/config.js');

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/userdb";
var url = 'mongodb://team12:mongoDBteam12@35.241.198.186:27017/?authMechanism=SCRAM-SHA-1&authSource=userdb';
var frequency = 4000;

const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });
mongoose.connect('mongodb://team12:mongoDBteam12@35.241.198.186:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });

const User = require('./db/userModel.js');
const ActivePlayer = require('./db/gameModel');

const getFirstActivePlayer = async function () {
    return (await ActivePlayer.findOne(
            {}, 'playerid', { sort: { 'created_at' : 1 } })
    ).playerid;
};

const HTTPSsecret = require('./ssl/https_config.js');

const https_options = {
    key: fs.readFileSync('./ssl/team12.key'),
    passphrase: HTTPSsecret,
    cert: fs.readFileSync('./ssl/team12.pem')
};

const port = 80;

//create a server object:
https.createServer(https_options, async function (req, res) {

    const {headers, method, url} = req;

    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();

        let obj = JSON.parse(body);
        const request = obj.request;

        console.log("\n            " + Date.now());
        switch (request) {
            case "signup":
                console.log("Request: signup ===============================================");
                const newUser = new User(obj);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Content-Type", "application/json");
                newUser.save( function(error) {
                    if (error) {
                        console.log(error);
                        res.write(JSON.stringify({
                            success: false,
                            message: error.message,
                        }));
                    } else {
                        res.write(JSON.stringify({
                            success: true,
                            token: newUser.createToken(),
                        }));
                    }
                    res.end();
                });
                console.log("    Created new user with id:    " + newUser._id);
                break;
            case "signin":
                console.log("Request: signin ===============================================");
                User.findOne({ email : obj.email }, async function (error, result) {
                    if (error) throw error;
                    if (result === null) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader("Content-Type", "application/json");
                        res.write(JSON.stringify({"email": false}));
                        res.end();
                    } else {
                        const value = await result.checkPassword(obj.password);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader("Content-Type", "application/json");
                        if (!value)
                            res.write(JSON.stringify({"email": true, "password": value}));
                        else
                            res.write(JSON.stringify({"email": true, "password": value, token: result.createToken() }));
                        res.end();
                        ActivePlayer.findOneAndRemove({playerid:result._id}, { sort: { 'created_at' : 1 }}, function() {
                            const newActivePlayer = new ActivePlayer({playerid: result._id, location: obj.position});
                            newActivePlayer.save();
                        });
                    }
                });
                break;
            case "signout":
                console.log("Request: signout ==============================================");
                jwt.verify(obj.token, secret, async function(err, token) {
                    if (err) {
                        console.log("invalid token");
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader("Content-Type", "ERROR");
                        res.end();
                        throw err;
                    } else {
                        console.log(token);
                        User.findById(token.id).then(
                            async function (user) {
                                if (user !== null)
                                    if (!(await user.checkToken(token))) {
                                        console.log("invalid token");
                                        res.setHeader('Access-Control-Allow-Origin', '*');
                                        res.setHeader("Content-Type", "ERROR");
                                        res.end();
                                    } else {
                                        ActivePlayer.findOne({playerid: user._id}, (err, result) => {
                                            if (result !== null) {
                                                result.delete();
                                                res.setHeader('Access-Control-Allow-Origin', '*');
                                                res.setHeader("Content-Type", "application/json");
                                                res.write(JSON.stringify({result: true}));
                                                res.end();
                                            } else {
                                                console.log("user not logged in");
                                                res.setHeader('Access-Control-Allow-Origin', '*');
                                                res.setHeader("Content-Type", "ERROR");
                                                res.end();
                                            }
                                        });
                                    }
                            });
                    }
                });
                break;
            case "jwt":
                console.log("Request: jwt ==================================================");
                jwt.verify(obj.token, secret, async function(err, token) {
                    if (err) {
                        console.log("invalid token");
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader("Content-Type", "ERROR");
                        res.end();
                        throw err;
                    } else {
                        console.log(token);
                        User.findById(token.id).then(
                            async function (user) {
                                console.log(user);
                                let value = false;
                                if (user !== null)
                                    value = await user.checkToken(token);
                                console.log(value);
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.setHeader("Content-Type", "application/json");
                                res.write(JSON.stringify({result: value}));
                                res.end();
                            });
                    }
                });
                break;
            case "Radar":
                console.log("Request: radar ================================================");
                if(obj.playerId !== null &&
                    (await ActivePlayer.findOne({playerid: obj.playerId})) !== null)
                    getPlayerPositionRadar(obj, res);
                else {
                    console.log("invalid playerid");
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader("Content-Type", "ERROR");
                    res.end();
                }
                break;
            case "sendSignal":
                console.log("Request: fixedSignal ==========================================");
                console.log("\n\n\n" + JSON.stringify(obj) + "\n\n\n");
                sendSignal(obj);
                break;
            case "fight":
                console.log("Request: fight ================================================");
                console.log("\n\n\n" + JSON.stringify(obj) + "\n\n\n");
                fight(obj);
                break;
            case "updateFrequency":
                console.log("Request: update frequency ================================================");
                updateFrequency(obj,res);
                break;
            case "frequency":
                console.log("Request: frequency ================================================");
                getFrequency(obj,res);
                break;
            default:
                console.log("Bad request ===================================================");
                break;
        }
        console.log("\n");
    });
}).listen(port);
console.log("\n\n    Server listening on localhost:" + port + "\n\n");

function getFrequency(jsonData,res){
    jsonData.frequency = frequency;
    jsonData.update = "true";
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "ERROR");
    res.write(JSON.stringify(jsonData));
    res.end();
}

function updateFrequency(jsonData,res){
    frequency = jsonData.frequency;
    jsonData.update = "true";
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "ERROR");
    res.write(JSON.stringify(jsonData));
    res.end();
}

async function getPlayerPositionRadar(jsonData,res) {
    let fp = await getFirstActivePlayer();
    fp = { firstPlayer : fp, frequency : frequency };
    var playerId = jsonData.playerId;
    var playerLongitude = jsonData.longitude;
    var playerLatitude = jsonData.latitude;
    var sendSignal = jsonData.sendSignal;

    ActivePlayer.findOne({ playerid: playerId}, function (error, result) {
        if (result!== null) {
            result.location.latitude = playerLatitude;
            result.location.longitude = playerLongitude;
            result.updated_at = Date.now();
            result.save();
        }
    });

    ActivePlayer.find({}, '-created_at -_id -updated_at -__v', {lean: true}, async function(error, result) {
        if (error) {
            res.write("No player positions available");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "ERROR");
            throw error;
        } else {
            result.forEach(function (elem) {
                console.log(elem);
                elem.playerId = elem.playerid;
                delete elem.playerid;
                elem.longitude = elem.location.longitude;
                elem.latitude = elem.location.latitude;
                delete elem.location.longitude;
                delete elem.location.latitude;
                delete elem.location;
            });

            result.push(fp);

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.write(JSON.stringify(result)); //write a response to the client
            res.end(); //end the response

            ActivePlayer.findOne({playerid: playerId}, function (error, result) {
                if (error) throw error;
                if (result !== null) {
                    result.sendSignal = "falseSignal";
                    result.dataSignal = null;
                    result.save();
                }
                console.log("sendSignal to false for player with id: " + playerId + ", result query: " + res);
            });
        }
    });
}

function sendSignal(obj) {
    ActivePlayer.findOne({playerid: obj.playerId}, function (error, result) {
        if (error) throw error;
        if (result !== null) {
            result.sendSignal = obj.sendSignal;
            result.dataSignal = obj.dataSignal;
            result.save();
        }
    });
}

function fight(obj){
    ActivePlayer.findOne({ playerid: obj.playerId }, function(error, result) {
        if (error) throw error;
        if (result !== null) {
            result.enemyPlayerId = obj.enemyPlayerId;
            result.save();
        }
    });

    ActivePlayer.findOne({ playerid: obj.enemyPlayerId }, function(error, result) {
        if (error) throw error;
        if (result !== null) {
            result.enemyPlayerId = obj.playerId;
            result.save();
        }
    });

    console.log("Enemies are created");
}
