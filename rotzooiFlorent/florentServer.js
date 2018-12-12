var https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = require('./db/config.js');

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/userdb";
// var url = 'mongodb://team12:mongoDBteam12@35.241.198.186:27017/?authMechanism=SCRAM-SHA-1&authSource=userdb';

var frequency = 3000;

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

const port = 8080;

const respond = function(res, data) {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(data));
    res.end();
};

//create a server object:
https.createServer(https_options, async function (req, res) {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();

        let obj = JSON.parse(body);
        const request = (obj.request).toLowerCase();

        console.log("\n\n\nRequest:    " + request + "    ===============    current time:    " + new Date().toLocaleTimeString());
        switch (request) {
            case "signup":
                signup(obj, res);
                break;
            case "signin":
                signin(obj, res);
                break;
            case "signout":
                signout(obj, res);
                break;
            case "jwt":
                verifyJWT(obj, res);
                break;
            case "radar":
                radar(obj, res);
                break;
            case "sendsignal":
                sendSignal(obj);
                res.end();
                break;
            case "fight":
                fight(obj);
                res.end();
                break;
            case "updatefrequency":
                updateFrequency(obj,res);
                break;
            case "frequency":
                getFrequency(obj,res);
                break;
            default:
                console.log("\n\n\n-------------------------");
                console.log("|                       |");
                console.log("|  ! unknown request !  |");
                console.log("|                       |");
                console.log("-------------------------\n\n\n");
                res.end();
                break;
        }
        // console.log("\n");
    });
}).listen(port);
console.log("\n\n    Server listening on localhost:" + port + "\n\n");

function signup(obj, res) {
    const newUser = new User(obj);
    newUser.save( function(error) {
        if (error) {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "ERROR");
            res.write(JSON.stringify({
                success: false,
                message: error.message,
            }));
        } else {
            respond(res, {
                success: true,
                name: newUser.name,
                token: newUser.createToken(),
            });
        }
        res.end();
    });
    const newActivePlayer = new ActivePlayer({playerid: result.name, location: obj.position});
    newActivePlayer.save();
}

function signin(obj, res) {
    User.findOne({ email : obj.email }, async function(error, result) {
        if (error) throw error;
        if (result === null) {
            respond(res, {"email": false});
        } else {
            const value = await result.checkPassword(obj.password);
            if (!value)
                respond(res, {"email": true, "password": value});
            else {
                respond(res, {
                    "email": true,
                    "password": value,
                    token: result.createToken(),
                    name: result.name
                });
                ActivePlayer.findOne({playerid: result.name}, function(error, act) {
                    if (act === null) {
                        const newActivePlayer = new ActivePlayer({playerid: result.name, location: obj.position});
                        newActivePlayer.save();
                    } else {
                        act.location = obj.position;
                        act.updated_at = Date.now();
                        act.save();
                    }
                })
            }
        }
    });
}

function signout(obj, res) {
    jwt.verify(obj.token, secret, async function(err, token) {
        if (err) {
            console.log("invalid token");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "ERROR");
            res.end();
            throw err;
        } else {
            User.findById(token.id).then(
                async function (user) {
                    if (user !== null)
                        if (!(await user.checkToken(token))) {
                            console.log("invalid token");
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader("Content-Type", "ERROR");
                            res.end();
                        } else {
                            ActivePlayer.findOne({playerid: user.name}, (err, result) => {
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
}

function verifyJWT(obj, res) {
    jwt.verify(obj.token, secret, async function(err, token) {
        if (err) {
            console.log("invalid token");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "ERROR");
            res.end();
            throw err;
        } else {
            User.findById(token.id).then(
                async function (user) {
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
}

function getFrequency(jsonData,res){
    jsonData.frequency = frequency;
    jsonData.update = "true";
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader("Content-Type", "ERROR");
    res.write(JSON.stringify(jsonData));
    res.end();
}

function updateFrequency(jsonData,res){
    frequency = jsonData.frequency;
    jsonData.update = "true";
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader("Content-Type", "ERROR");
    res.write(JSON.stringify(jsonData));
    res.end();
}

async function radar(obj, res) {
    if (obj.token) {
        jwt.verify(obj.token, secret, async function(err, token) {
            if (err) {
                console.log("invalid token");
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Content-Type", "ERROR");
                res.end();
            } else {
                obj.playerId = token.name;
                if(obj.playerId !== null && obj.playerId !== "") {
                    if (await ActivePlayer.findOne({playerid: obj.playerId}) === null) {
                        const newActivePlayer = new ActivePlayer({
                            playerid: obj.playerId,
                            location: {
                                latitude: obj.latitude,
                                longitude: obj.longitude,
                            }
                        });
                        newActivePlayer.save();
                    }
                    getPlayerPositionRadar(obj, res);
                } else {
                    console.log("invalid playerid");
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader("Content-Type", "ERROR");
                    res.end();
                }
            }
        });
    }
}

async function getPlayerPositionRadar(jsonData,res) {
    let fp = await getFirstActivePlayer();
    fp = { firstPlayer : fp };

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
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "ERROR");
            res.write("No player positions available");
            throw error;
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Content-Type", "application/json");

            result.forEach(function (elem) {
                elem.playerId = elem.playerid;
                delete elem.playerid;
                elem.longitude = elem.location.longitude;
                elem.latitude = elem.location.latitude;
                delete elem.location.longitude;
                delete elem.location.latitude;
                delete elem.location;
            });

            result.push(fp);

            res.write(JSON.stringify(result)); //write a response to the client
            res.end(); //end the response

            ActivePlayer.findOne({playerid: playerId}, function (error, result) {
                if (error) throw error;
                if (result !== null) {
                    result.sendSignal = "falseSignal";
                    result.dataSignal = null;
                    result.save();
                }
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

function calculateAttack(self, other) {
    return (self.attack * self.attack / (self.attack + other.defence)) * (Math.random() * 11 + 5) / 20;
}

function fight(obj){
    User.findOne({ name: obj.playerId}, function(error, self) {
        User.findOne({name: obj.enemyPlayerId}, function (error, enemy) {
            if (self !== null && enemy !== null) {
                const enemyDamage = calculateAttack(self, enemy);
                enemy.health = enemy.health - enemyDamage;
                enemy.save();
            }
        });
    });

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

    console.log(obj.playerId + " kicked " + obj.enemyPlayerId +"!");
}
