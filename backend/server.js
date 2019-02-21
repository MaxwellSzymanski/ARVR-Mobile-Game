var https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = require('./db/config.js');

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/userdb";
// var url = 'mongodb://team12:mongoDBteam12@35.241.198.186:27017/?authMechanism=SCRAM-SHA-1&authSource=userdb';

var frequency = 1000;

const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });
mongoose.connect('mongodb://team12:mongoDBteam12@localhost:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });

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
const server = https.createServer(https_options, async function (req, res) {

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
                console.log("\n\n\n ----------------------- ");
                console.log("/                       \\");
                console.log("|  ! unknown request !  |");
                console.log("\\                       /");
                console.log(" ----------------------- \n\n\n");
                res.end();
                break;
        }
        // console.log("\n");
    });
}).listen(port);
console.log("\n\n    Server listening on localhost:" + port + "\n\n");


// var server = https.createServer(https_options);
var io = require('socket.io')(server);
// server.listen(port);

io.sockets.on('connection', function (socket) {
    console.log("new connection");

    socket.on('signup', (data) => {signup(data, socket)});

    socket.on('verify', (data) => {verifyEmail(data, socket)});

    socket.on("newmail", (data) => {newMail(data)});

    socket.on("signin", (data) => {signin(data, socket)});

    socket.on("signout", (data) => {signout(data, socket)});

    socket.on("stats", (data) => {stats(data, socket)});

    socket.on("location", (data) => {updateLocation(data, socket)});

    socket.on("signal", (data) => {signal(data)});

    socket.on("handshake", (data) => {})

    socket.on("disconnect", () => {removePlayer(socket)});
    
});


// SOCKET EVENT HANDLING

function signup(data, socket) {
    console.log("signup:    " + data.email);
    const newUser = new User(data);
    newUser.save( function(error) {
        if (error) {
            socket.emit('signup', {
                success: false,
                message: error.message
            });
        } else {
            socket.emit('signup', {
                success: true,
                name: newUser.name,
                token: newUser.createToken()
            });
            newUser.sendVerifMail();
        }
    });
    const newActivePlayer = new ActivePlayer({playerid: data.name, location: data.position});
    newActivePlayer.save();
};

function verifyEmail(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(verifyEmail)   invalid token");
            throw err;
        } else {
            User.findById(token.id).then(
                async function(user) {
                    const result = await user.verify(data.code);
                    socket.emit("verify", {success: result});
                });
        }
    })
}

function newMail(data) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(newMail)       invalid token");
            throw err;
        } else {
            User.findById(token.id).then(
                async function(user) {
                    user.sendVerifMail();
            });
        }
    })
}

function signin(data, socket) {
    User.findOne({ email : data.email }, async function(error, result) {
        if (error) throw error;
        if (result === null) {
            socket.emit("signin", {"email": false});
        } else {
            const value = await result.checkPassword(data.password);
            console.log("checkPassword:   " + await value);
            if (!(await value))
                socket.emit("signin", {"email": true, "password": value});
            else {
                socket.emit("signin", {
                    email: true,
                    password: value,
                    token: result.createToken(),
                    name: result.name
                });
                ActivePlayer.findOne({playerid: result.name}, function(error, act) {
                    if (act === null) {
                        const newActivePlayer = new ActivePlayer({playerid: result.name, location: data.position});
                        newActivePlayer.save();
                    } else {
                        act.updateLocation = data.position;
                        act.updated_at = Date.now();
                        act.save();
                    }
                })
            }
        }
    });
}

function signout(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(signout)       invalid token");
            socket.emit("signout", {result:false});
            throw err;
        } else {
            User.findById(token.id).then(
                async function (user) {
                    if (user !== null)
                        if (!(await user.checkToken(token))) {
                            console.log("(signout)       invalid token");
                            socket.emit("signout", {result:false});
                        } else {
                            ActivePlayer.findOne({playerid: user.name}, (err, result) => {
                                if (result !== null) {
                                    result.delete();
                                    socket.emit("signout", {result:true});
                                } else {
                                    console.log("user not logged in");
                                    socket.emit("signout", {result:true});
                                }
                            });
                        }
                });
        }
    });
}

function stats(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(stats)         invalid token");
        } else {
            User.findById(token.id).then(
                function (user) {
                    if (user === null) {
                        console.log("(stats)         No user found");
                    } else {
                        socket.emit("stats", user.getUserData());
                        socket.emit("photo", {image: user.image} )
                    }
            });
        }
    })
}

let game = {};
function updateLocation(data, socket) {
    if (data.token) {
        jwt.verify(data.token, secret, async function(err, token) {
            if (err) {
                console.log("(location)      invalid token");
            } else {
                User.findById(token.id).then(
                    function (user) {
                        if (user !== null) {
                            game[user.name] = {
                                socket: socket,
                                longitude: data.longitude,
                                latitude: data.latitude,
                                updatedAt: new Date()
                            };
                            // Object.keys(game).forEach( function(player) {
                            //     console.log(player + ":\n   (" + game[player].latitude +", " + game[player].longitude +")");
                            // });
                            socket.broadcast.emit("playerdata", {
                                id: user.name,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                updatedAt: new Date()
                            })
                        }
                    }
                )
            }
        })
    }
}

function signal(data) {
    if (data.token) {
        jwt.verify(data.token, secret, async function(err, token) {
            if (err) {
                console.log("(signal)        invalid token");
            } else {
                User.findById(token.id).then(
                    function (sender) {
                        if (sender !== null) {
                            Object.keys(game).forEach(function (receiver) {
                                if (receiver === data.receiver) {
                                    if (data.type === "special")
                                        receiver.socket.emit("specialsignal", {sender: sender.name});
                                    else if (data.type === "handshake")
                                        receiver.socket.emit("handshake", {sender: sender.name});
                                    else if (data.type === "ACKhandshake")
                                        receiver.socket.emit("ACKhandshake", {sender: sender.name});
                                    return;
                                }
                            })
                        }
                    })
            }
        });
    }
}

function removePlayer(socket) {
    Object.keys(game).forEach( function (username) {
        if (game[username].socket === socket) {
            delete game[username];
        }
    })
}


// ============================================================================

// OLD REQUEST HANDLING

// ============================================================================


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
                    let jwtValid = false;
                    let emailVerified = false;
                    if (user !== null) {
                        jwtValid = await user.checkToken(token);
                        emailVerified = user.verified;
                    }
                    console.log(jwtValid);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader("Content-Type", "application/json");
                    res.write(JSON.stringify({jwt: jwtValid,
                                              verified: emailVerified}));
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
    // let fp = await getFirstActivePlayer();
    // fp = { firstPlayer : fp };

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

            // result.push(fp);

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
    return (self.attack * self.attack / (self.attack + other.defence)) * (Math.random() * 11 + 4 + self.level) / (20 + self.level);
}

function fight(obj){
    User.findOne({ name: obj.playerId}, function(error, self) {
        User.findOne({name: obj.enemyPlayerId}, function (error, enemy) {
            if (self !== null && enemy !== null) {
                const enemyDamage = calculateAttack(self, enemy);
                enemy.health = Math.floor(enemy.health - enemyDamage);
                if (enemy.health <= 0) {
                    enemy.health = 100;
                    self.level = self.level + 1;
                    self.save();
                }
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
