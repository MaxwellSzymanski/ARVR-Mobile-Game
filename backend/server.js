var https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = require('./db/config.js');

var frequency = 1000;

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
            case "signup":
                signuphttp(obj, res);
                break;
            case "signin":
                signinhttp(obj, res);
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

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log("new connection");

    socket.on("jwt", (data) => {verifyJWT(data, socket)});

    socket.on('signup', (data) => {signup(data, socket)});

    socket.on('verify', (data) => {verifyEmail(data, socket)});

    socket.on("newmail", (data) => {newMail(data)});

    socket.on("signin", (data) => {signin(data, socket)});

    socket.on("signout", (data) => {signout(data, socket)});

    socket.on("stats", (data) => {stats(data, socket)});

    socket.on("location", (data) => {updateLocation(data, socket)});

    socket.on("signal", (data) => {signal(data)});

    socket.on("disconnect", () => {removePlayer(socket)});

    // socket.on('getPlayerEntry', (name, fv) => {
    //     console.log('received player entry from: ' + name);
    //     addPlayerEntry(name, fv);
    // });

    socket.on('getFVfromDB', () => {
        getFeatureVectorsFromDB(function(result) {
            socket.emit('sentFVfromDB', result);
        })
    });

	socket.on('getStatsById', (id) => {
        getStatsById(id, socket) });
        // function(result, id) {
        //         socket.emit('sentStatsById', result);
        //     }
        // })
    // });

    socket.on('addToJSON', (json, callback) => {
        fs.writeFile('testFeatureVectors.json', json, 'utf8', callback);
    });

    socket.on("fight", (data) => {fight(data, socket)});


});


// SOCKET EVENT HANDLING

function signup(dat, socket) {
    const data = JSON.parse(dat);
    // console.log("signup:    " + data.email);
    // console.log("password:  " + data.password);
    const newUser = new User({
        name: data.name,
        password: data.password,
        email: data.email,
        image: data.image,
        featureVector: data.featureVector
    });
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
    console.log("            New mail requested.");
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(newMail)       invalid token");
            throw err;
        } else {
            User.findById(token.id).then(
                function(user) {
                    user.sendVerifMail();
            });
        }
    })
}

async function signin(dat, socket) {
    const data = JSON.parse(dat);
    // console.log("\ndata.password    " + data.password);
    // console.log("data.email       " + data.email);
    User.findOne({ email : data.email }, async function(error, result) {
        if (error) throw error;
        if (result === null) {
            socket.emit("signin", {"email": false});
        } else {
            const pass = data.password;
            // console.log(pass);
            // console.log("result.email     " + result.email);
            // console.log(result.password);
            const value = await result.checkPassword(pass);
            console.log("checkPassword:   " + value);
            if (value) {
                socket.emit("signin", {
                    email: true,
                    password: value,
                    token: result.createToken(),
                    name: result.name
                });
            } else {
                socket.emit("signin", {"email": true, "password": value});
            }
        }
    });
}

function signout(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(signout)       invalid token");
            socket.emit("signout", {success:false});
            throw err;
        } else {
            socket.emit("signout", {success: true});
            delete game[token.name];
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
                            // let fightToken;
                            // if (game[user.name] === undefined || game[user.name] === null)
                            //     fightToken = user.createFightToken();
                            // else
                            //     fightToken = game[user.name].fightToken;
                            game[user.name] = {
                                socket: socket,
                                longitude: data.longitude,
                                latitude: data.latitude,
                                updatedAt: new Date(),
                                // fightToken: fightToken,
                            };
                            // Object.keys(game).forEach( function(player) {
                            //     console.log(player + ":\n   (" + game[player].latitude +", " + game[player].longitude +")");
                            // });
                            // socket.broadcast.emit("playerdata", {
                            //     id: user.name,
                            //     latitude: data.latitude,
                            //     longitude: data.longitude,
                            //     updatedAt: new Date()
                            // });
                            broadcastLocation(socket, {
                                id: user.name,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                updatedAt: new Date()
                            });
                        }
                    }
                )
            }
        })
    }
}

function broadcastLocation(data) {
    Object.keys(game).forEach( function (key) {
        game[key].socket.emit("playerdata", data)
    })
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
                                        game[receiver].socket.emit("specialsignal", {sender: sender.name});
                                    else if (data.type === "handshake")
                                        game[receiver].socket.emit("handshake", {sender: sender.name});
                                    else if (data.type === "ACKhandshake")
                                        game[receiver].socket.emit("ACKhandshake", {sender: sender.name});
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

function verifyJWT(data, socket) {
    console.log("checking token");
    if (!data.token) return;
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("invalid token");
            socket.emit("jwt", {loggedIn: false, verified: false});
            throw err;
        }
        User.findById(token.id).then(
            async function (user) {
                let jwtValid = false;
                let emailVerified = false;
                if (user !== null) {
                    jwtValid = await user.checkToken(token);
                    emailVerified = user.verified;
                }
                console.log("jwt valid:" + jwtValid);
                socket.emit("jwt", {
                    loggedIn: jwtValid,
                    verified: emailVerified
            });
        });
    });
}



// ============================================================================

// FACE RECOGNITION

// ============================================================================


//MongoDB code
var names;

// function addPlayerEntry(name, fv) {
//   MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("userdb");
//     var myobj = { username: name , featureVector: fv };
//     dbo.collection("facerecognition").insertOne(myobj, function(err, res) {
//       if (err) throw err;
//       db.close();
//     });
//   });
// }

async function getStatsById(callBack, id) {
  User.findOne( {name: id}).exec( function(error, result) {
      if (error) throw error;
      socket.emit('sentStatsById', result.getEnemyData());
  });
}

async function getFeatureVectorsFromDB(callBack) {
  User.find( {}, 'name featureVector').lean().exec( function(error, array) {
      if (error) throw error;
      return callBack(array);
  });
}


// ============================================================================

// OLD REQUEST HANDLING

// ============================================================================


function signuphttp(obj, res) {
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
    newUser.sendVerifMail();
}

function signinhttp(obj, res) {
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
                    verified: result.verified,
                    token: result.createToken(),
                    name: result.name
                });
                if (!result.verified) result.sendVerifMail();
            }
        }
    });
}


// ============================================================================

// BATTLE

// ============================================================================





// Functie van vorig semester
function calculateAttack(self, other) {
    return (self.attack * self.attack / (self.attack + other.defence)) * (Math.random() * 11 + 4 + self.level) / (20 + self.level);
}

function fight(data, socket){
    if (data.token) {
        jwt.verify(data.token, secret, async function(err, token) {
            if (err) {
                console.log("(fight)         invalid token");
            } else {
                User.findById(token.id).then(
                    function (error, attacker) {
                        User.findOne({ name: data.enemy}).then(
                            function (error, defender) {
                                // TODO: pas data aan, check eventueel ./db/userModel.js voor namen andere attributen
                                attacker.health = attacker.health;
                                defender.health = defender.health;
                                // TODO
                                if (defender.health <= 0) {
                                    // TODO
                                }

                                attacker.save();
                                defender.save();

                                // TODO: indien er andere stats doorgestuurd moeten worden, pas dan de methoden
                                //              getUserData en getEnemyData aan in ./db/userModel.js

                                // Send user data to attacker and to defender
                                socket.emit("stats", attacker.getUserData());
                                socket.emit("enemystats", defender.getEnemyData());
                                if (game[defender.name] !== undefined && game[defender.name] !== null) {
                                    game[defender.name].socket.emit("stats", defender.getUserData());
                                    game[defender.name].socket.emit("enemystats", defender.getEnemyData());
                                }
                            }
                        )
                    }
                )
            }
        })
    }
}


/*  FIGHT VAN VORIG SEMESTER



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

    console.log(obj.playerId + " kicked " + obj.enemyPlayerId +"!");


*/
