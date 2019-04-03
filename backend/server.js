var https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = require('./db/config.js');

var frequency = 1000;

const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });
// mongoose.connect('mongodb://team12:mongoDBteam12@35.241.198.186:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });
mongoose.connect('mongodb://13.95.120.117:27017/userdb',  { useNewUrlParser: true });

const User = require('./db/userModel.js');

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
    socket.on("faction", (data) => {faction(data, socket)});
    socket.on("signin", (data) => {signin(data, socket)});
    socket.on("signout", (data) => {signout(data, socket)});
    socket.on("deleteaccount", (data) => {deleteAccount(data, socket)});
    socket.on("stats", (data) => {stats(data, socket)});
    socket.on("location", (data) => {updateLocation(data, socket)});
    socket.on("signal", (data) => {signal(data)});
    socket.on("getProb", (data) => {calculateProbability(data, socket)});
    // socket.on('getPlayerEntry', (name, fv) => {
    //     console.log('received player entry from: ' + name);
    //     addPlayerEntry(name, fv);
    // });
    socket.on('getFVMatch', async (fv) => {
        getFeatureVectorsFromDB( async function(result) {
            let match = await getFVMatch(fv, result);
			socket.emit('sentFVMatch', match);
        })
    });
	socket.on('getStatsById', (id) => {
        getStatsById(id, socket) });
	socket.on('getFVById', (id) => {
        getFVById(id, socket) });
	socket.on('newImage', (data) => {
         });
    socket.on('addToJSON', (json, callback) => {
        fs.writeFile('testFeatureVectors.json', json, 'utf8', callback);
    });
    socket.on("fight", (data) => {fight(data, socket)});
    socket.on("miss", (data) => {miss(data, socket)});
    socket.on("tictacMove", (data) => {tictac(data, socket)});
    socket.on("initTictac", (data) => {initTictac(data, socket)});

    socket.on("resetTutorials", (data) => {resetTutorial(data)});

    socket.on("disconnect", () => {removePlayer(socket)});
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
                async function(user) {
                    user.sendVerifMail();
            });
        }
    })
}

function faction(data, socket) {
    jwt.verify(data.token, secret, async function (err, token) {
        if (err) {
            console.log("(faction)       invalid token");
            socket.emit("faction", {success: false})
        } else {
            User.findById(token.id).then(
                function (user) {
                    if (user === null ||
                        (data.faction !== "loneWolf" && data.faction !== "adventurer" && data.faction !== "scavenger")) {
                        socket.emit("faction", {success: false});
                    } else {
                        user.faction = data.faction;
                        user.save();
                        socket.emit("faction", {success: true});
                    }
                });
        }
    });
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
            console.log("(signout)       invalid token:\n" + err);
            socket.emit("signout", {success: false});
            return;
        }
        socket.emit("signout", {success: true});
        delete game[token.name];
        console.log(token.name + " signed out.");
    });
}

function deleteAccount(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(delete)        invalid token");
            socket.emit("deleteaccount", {success: false});
            return;
        }
        User.findByIdAndRemove(token.id).then(
            function (user) {
                if (user === null) {
                    console.log("(delete)        No user found");
                    socket.emit("deleteaccount", {success: false});
                    return;
                }
                socket.emit("deleteaccount", {success: true});
            });
    });
}

function newImage(data) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(newImage)     invalid token");
            return;
        }
        User.findById(token.id).then(
            function (user) {
                if (user === null) {
                    console.log("(newImage)     No user found");
                    return;
                }
                user.image = data.img;
                user.save();
            });
    })
}


function stats(data, socket) {
    if (!data.token) {
        console.log("(stats)     no token.");
        return;
    }
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(stats)         invalid token");
            return;
        } else if (!token.login)
            return;
        User.findById(token.id).then(
            function (user) {
                if (user === null) {
                    console.log("(stats)         No user found");
                } else {
                    socket.emit("stats", user.getUserData());
                    socket.emit("photo", {image: user.image})
                }
            });

    });
    if (!data.enemy)
        return;
    jwt.verify(data.enemy, secret, async function (err, token) {
        if (err) {
            console.log("(stats)         invalid enemy token");
            return;
        } else if (!token.attack)
            return;
        User.findOne({name: token.name}).then(
            function (enemy) {
                if (enemy === null) {
                    console.log("(stats)         No enemy found");
                } else {
                    socket.emit("enemystats", enemy.getEnemyData());
                    socket.emit("enemyphoto", enemy.image);
                }
            }
        )
    });
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
                                accuracy: data.accuracy
                                // fightToken: fightToken,
                            };
                            // Object.keys(game).forEach( function(player) {
                            //     console.log(player + ":\n   (" + game[player].latitude +", " + game[player].longitude +")");
                            // });
                            socket.broadcast.emit("playerdata", {
                                id: user.name,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                updatedAt: new Date(),
                                accuracy: data.accuracy
                            });
                            // let broadcast = {
                            //     id: user.name,
                            //     latitude: data.latitude,
                            //     longitude: data.longitude,
                            //     updatedAt: new Date()
                            // };
                            // Object.keys(game).forEach( function (key) {
                            //     game[key].socket.emit("playerdata", broadcast)
                            // })
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

async function getStatsById(id, socket) {
  User.findById(id).exec( function(error, result) {
      if (error) throw error;
      if (result !== null) {
          socket.emit('sentStatsById', result.getEnemyData());
          socket.emit('enemyphoto', result.image);
      }
  });
}

async function getFVById(data, socket) {
    jwt.verify(data.token, secret, async function(err, token) {
        if (err) {
            console.log("(stats)         invalid token");
        } else {
            User.findById(token.id).then(
                function (user) {
                    if (user === null) {
                        console.log("(stats)         No user found");
                    } else {
                        socket.emit('sentFVById', user.featureVector);
                    }
                });
		}
	})
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

const factions = ["loneWolf", "adventurer", "scavenger"];
const fieldTestToken = require('./fieldTestToken.js');
function signuphttp(obj, res) {
    // if (!obj.token || obj.token !== fieldTestToken) {
    //     console.log("(sign up)      Doesn't have field test token.");
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     res.setHeader("Content-Type", "ERROR");
    //     res.write(JSON.stringify({
    //         success: false,
    //         message: "You're not a field test participant and are not allowed to join this game.",
    //     }));
    //     res.end();
    //     return;
    // }
    const newUser = new User(obj);
    newUser.faction = factions[Math.floor(Math.random() * factions.length)];
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
            newUser.sendVerifMail();
        }
        res.end();
    });
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

// APP HELPER FUNCTIONS

// ============================================================================


function generateWord(type) {
    let words = [''];
    switch(type) {
        case 'shout':
            words = ['Ow yes!', 'Hell yeah!', 'Sweet lord!', 'Ooh boy!', 'Sweet nibblets!'];
            break;
        case 'miss':
            words = ['Better luck next time!', 'You gave it your best shot...', 'Ouch!', 'That hurt!'];
            break;
        case 'default':
            break;
    }
    return words[Math.floor(Math.random() * words.length)];
}


function resetTutorial(data) {
    if (data.token) {
        jwt.verify(data.token, secret, async function (err, token) {
            if (err) {
                console.log("(resetTutorial)         invalid token");
                return;
            }
            User.findById(token.id).then(
                async function (player) {
                    if (player === null) {
                        console.log("(resetTutorial)           player not found.");
                        return;
                    }
                    player.battleTutorialSeen = false;
                    player.mainTutorialSeen = false;
                    player.save();
                }
            )
        })
    }
}





// FACERECOGNITION ==============================================================
async function getFVMatch(fv, results) {
    let fv1 = Object.values(JSON.parse(fv));
    let minDist = 1;
    let index = null;
    const threshold = 0.52;
    let i = 0;
    for (i; i < results.length; i++) {
        if (results[i].featureVector != null) {
            let fv2 = Object.values(JSON.parse(results[i].featureVector));
            let dist = await euclideanDistance(fv1, fv2);
            if (minDist > dist && dist <= threshold) {
                console.log(dist);
                minDist = dist;
                index = i;
            }
        }
    }
    if (index !== null) {
        console.log(results[index].name);
        return User.findOne({name: results[index].name}).then(async function (user) {
            if (user === null)
                return null;
            // results[index].token = await user.createFightToken();
            let result = { name: user.name,
                _id: user._id,
                token: await user.createFightToken()};
            return (result);
        });
    }
    else return null;
}

async function euclideanDistance(arr1, arr2) {
	if (arr1.length !== arr2.length)
		throw new Error('euclideanDistance: arr1.length !== arr2.length');
	var desc1 = Array.from(arr1);
	var desc2 = Array.from(arr2);
	return Math.sqrt(desc1
		.map(function (val, i) { return val - desc2[i]; })
		.reduce(function (res, diff) { return res + Math.pow(diff, 2); }, 0));
}
// ============================================================================



function miss(data, socket) {
    if (data.token) {
        jwt.verify(data.token, secret, async function (err, token) {
            if (err) {
                console.log("(miss)         invalid token");
                return;
            }
            User.findById(token.id).then(
                async function (player) {
                    if (player === null) {
                        console.log("(miss)           player not found.");
                        return;
                    }
                    let message = "You took " + Math.round(player.health * 0.1) + " damage! " + generateWord("miss");
                    player.health = player.health * 0.9;
                    player.save();
                    socket.emit("miss", {message: message});
                }
            )
        })
    }
}


function calculateProbability(data, socket) {
    if (data.token) {
        jwt.verify(data.token, secret, async function(err, token) {
            if (err) {
                console.log("(prob)           invalid token");
                return;
            }
            User.findById(token.id).then(
                async function (player) {
                    if (player === null) {
                        console.log("(prob)             player not found.");
                        return;
                    }
                    const fatigue = calculateFatigue(player.health, player.level);
                    const stamina = calculateFatigue(player.health, player.level);
                    const motivation = calculateFatigue(player.kills, player.deaths, player.experience);
                    const prob = Math.max((0.33 * fatigue + 0.33 * stamina + 0.33 * motivation), 0.30);
                    socket.emit("probData", {
                        probability: prob,
                        fatigue: fatigue,
                        motivation: motivation,
                        stamina: stamina
                    })
                }
            )
        }
        )
    }
}

function capValue(value) {
    if (value < 0) {return 0}
    else if (value > 0) {return 1}
    else {return value}
}

function calculateFatigue(health, level) {
    return capValue(1-(health/100) - Math.min(level / 30, 0.3));
}

function calculateStamina(health, level) {
    capValue((health / 100) + Math.min(level / 30, 0.3));
}

function calculateMotivation(kills, deaths, experience) {
    return capValue((kills / (kills + deaths) +  ((experience / 350) * 0.5)));
}

// Functie van vorig semester
function calculateAttack(self, other) {
    return (self.attack * self.attack / (self.attack + other.defence)) * (Math.random() * 11 + 4 + self.level) / (20 + self.level);
}

function fight(data, socket) {
    if (!data.enemy || !data.token)
        return;
    jwt.verify(data.token, secret, async function (err, token) {
        if (err) {
            console.log("(fight)         invalid token");
            return;
        }
        User.findById(token.id).then(
            async function (attacker) {
                if (attacker === null) {
                    console.log("(fight)           attacker not found.");
                    return;
                }
                jwt.verify(data.enemy, secret, async function (err, token) {
                    if (err) {
                        console.log("(fight)         invalid defender token");
                        return;
                    } else if (!token.attack)
                        return;
                    User.findOne({name: token.name}).then(
                        async function (defender) {
                            if (!defender) {
                                console.log("(fight)           defender not found.");
                                return;
                            }

                            let attack = Math.ceil(calculateAttack(attacker, defender));
                            let attackXP = Math.ceil(attack * (1.5 + 0.5 * Math.random()));
                            let msgA = "You inflicted " + attack + " damage to " + defender.name + " and ";
                            defender.health = defender.health - attack;
                            if (defender.health <= 0) {
                                defender.health = defender.health + 100;
                                defender.deaths = defender.deaths + 1;
                                attacker.kills = attacker.kills + 1;
                                attackXP += 50;
                                msgA += "killed him/her.\nYou "
                            }
                            attacker.experience = attacker.experience + attackXP;
                            defender.experience = defender.experience + 10;
                            if (attacker.experience >= 350) {
                                attacker.level = attacker.level + 1;
                                attacker.experience = attacker.experience % 350;
                            }
                            if (defender.experience >= 350) {
                                defender.level = defender.level + 1;
                                defender.experience = defender.experience % 350;
                            }
                            msgA += "gained " + attackXP + " experience points.";

                            attacker.save();
                            defender.save();

                            // Send user data to attacker and to defender
                            socket.emit("stats", attacker.getUserData());
                            socket.emit("enemystats", defender.getEnemyData());
                            socket.emit("attack", {message: msgA});

                            if (game[defender.name] !== undefined && game[defender.name] !== null) {
                                game[defender.name].socket.emit("stats", defender.getUserData());
                                const msgD = "You have been attacked by " + attacker.name + "!";
                                game[defender.name].socket.emit("message", {message: msgD});
                            } else
                            {
                                console.log("player not online")
                            }
                        }
                    )
                })
            })
    })
}


function initTictac(data, socket) {
    if (!data.enemy || !data.token)
        return;
    jwt.verify(data.token, secret, async function (err, token) {
        if (err) {
            console.log("(initTictac)         invalid token");
            return;
        }
        User.findById(token.id).then(
            async function (attacker) {
                if (attacker === null) {
                    console.log("(initTictac)           attacker not found.");
                    return;
                }

                    if (err) {
                        console.log("(initTictac)         invalid defender token");
                        return;
                    } else if (!token.attack)
                        return;
                    User.findOne({name: token.name}).then(
                        async function (opponent) {
                            if (!opponent) {
                                console.log("(initTictac)           opponent not found.");
                                return;
                            }

                            let you = Math.random() < 0.5 ? 'x' : 'o';
                            let opp = you === 'x' ? 'o' : 'x';
                            // TODO: Implement fatigue
                            let turn = Math.random() < 0.5 ? you : opp;

                            // Send user data to attacker and to defender
                            socket.emit("initResponse", {ownIcon: you, turn: turn});
                            console.log("response:::" + opponent.name);
                            if (game[opponent] !== undefined && game[opponent.name] !== null) {
                                game[opponent].socket.emit("oppTictac", {ownIcon: you, turn: turn});
                            }
                        }
                    )

            })
    })
}


function tictac(data, socket) {
    if (!data.enemy || !data.token)
        return;
    jwt.verify(data.token, secret, async function (err, token) {
        if (err) {
            console.log("(tictac)         invalid token");
            return;
        }
        User.findById(token.id).then(
            async function (attacker) {
                if (attacker === null) {
                    console.log("(tictac)           attacker not found.");
                    return;
                }
                jwt.verify(data.enemy, secret, async function (err, token) {
                    if (err) {
                        console.log("(tictac)         invalid defender token");
                        return;
                    } else if (!token.attack)
                        return;
                    User.findOne({name: token.name}).then(
                        async function (opponent) {
                            if (!opponent) {
                                console.log("(tictac)           opponent not found.");
                                return;
                            }

                            socket.emit("tictac", {board: data.gameBoard});


                            // Send user data to attacker and to defender
                            socket.emit("stats", attacker.getUserData());
                            socket.emit("enemystats", defender.getEnemyData());
                            socket.emit("attack", {message: msgA});

                            if (game[opponent.name] !== undefined && game[defender.name] !== null) {
                                game[opponent.name].socket.emit("stats", defender.getUserData());
                            }
                        }
                    )
                })
            })
    })
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
