var https = require('https');
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/userdb";
var url = 'mongodb://team12:mongoDBteam12@35.241.198.186:27017/?authMechanism=SCRAM-SHA-1&authSource=userdb';
var frequency = 4000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://team12:mongoDBteam12@35.241.198.186:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });

const User = require('./db/userModel.js');
const ActivePlayer = require('./db/gameModel');

const getFirstActivePlayer = async function () {
    return await User.findById(
        (await ActivePlayer.findOne(
            {}, 'playerid', { sort: { 'created_at' : 1 } })
        ).playerid);
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
        console.log("\n");
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
                console.log(newUser._id);
                break;
            case "signin":
                console.log("Request: signin ===============================================");
                console.log(obj.position);
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
                        res.write(JSON.stringify({"email": true, "password": value}));
                        res.end();
                        const newActivePlayer = new ActivePlayer({playerid: result._id, location: obj.position});
                        newActivePlayer.save();
                    }
                });
                break;
            case "Radar":
                console.log("Request: radar ================================================");
                if(obj.playerId !== null &&
                        (await ActivePlayer.findOne({playerid: obj.playerId})) !== null)
                    getPlayerPositionRadar(obj, res);
                break;
            case "sendSignal":
                console.log("Request: fixedSignal ==========================================");
                sendSignal(obj);
                break;
            case "fight":
                console.log("Request: fight ================================================");
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
    var playerId = jsonData.playerId;
    var playerLongitude = jsonData.longitude;
    var playerLatitude = jsonData.latitude;
    var sendSignal = jsonData.sendSignal;

    ActivePlayer.findOne({ playerid: playerId}, function (error, result) {
        if (result!== null) {
            result.location.latitude = playerLatitude;
            result.location.longitude = playerLongitude;
            result.save();
        }
    });

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("userdb");

        console.log("Insert position of player with id: "+playerId);

        var query = { playerid:playerId };
        var newvalues = { $set: {longitude : 1, latitude : playerLatitude } };
        dbo.collection("activeplayers").updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("\nUpdate DB for player positions with id: "+playerId+ ", result query: "+res +"\n");
        });

        console.log("Get Players nearby(RADAR)!");

        var query = {};
        const select = { 'playerid': 1, 'location.latitude': 1, 'location.longitude': 1, _id: 0 };
        // ActivePlayer.find({}, function (err, result) {
        dbo.collection("activeplayers").find(query, select).toArray(async function (err, result) {

            if (err){
                res.write("No player positions available");
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Content-Type", "ERROR");
                throw err;
            } else {
                db.close();

                // Filter players on distance
                //var resultFilter = filterPlayers(result, playerLongitude, playerLatitude, range);

                result.forEach( function(elem) {
                    elem.playerId = elem.playerid;
                    delete elem.playerid;
                    elem.longitude = elem.location.longitude;
                    delete elem.location.longitude;
                    elem.latitude = elem.location.latitude;
                    delete elem.location.latitude;
                });

                res.setHeader('Access-Control-Allow-Origin', '*');
                console.log("Result: "+JSON.stringify(result));
                res.write(JSON.stringify(result)); //write a response to the client
                res.end(); //end the response
                // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            }
        });

        // update database after signal
        var query = { playerid: playerId };
        var newvalues = { $set: {sendSignal: "falseSignal", dataSignal: null} };
        dbo.collection("activeplayers").updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("sendSignal to false for player with id: "+playerId+", result query: "+ res);
            db.close();
        });
    });
}

function sendSignal(obj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("activeplayers");

        var myquery = { playerid: obj.playerId };
        var newvalues = { $set: {sendSignal : obj.sendSignal, dataSignal: obj.dataSignal} };
        dbo.collection("activeplayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("Signal send to player with id: "+obj.playerId+", result query: "+ res);
            db.close();
        });
    });
}

function fight(obj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("activeplayers");

        var myquery = { playerid: obj.playerId };
        var newvalues = { $set: {enemyPlayerId : obj.enemyPlayerId} };
        dbo.collection("activeplayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(res+ "result fight")
        });
        db.close();

    });

        var myquery = { playerid: obj.enemyPlayerId };
        var newvalues = { $set: {enemyPlayerId : obj.idPlayer} };
        dbo.collection("activeplayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(res+ "result fight")
        });

        db.close();
    });

    console.log("Enemies are created");



}
