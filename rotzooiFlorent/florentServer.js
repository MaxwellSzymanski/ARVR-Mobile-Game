var http = require('http');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const insertUser = require('./insertUser.js');
const verifyUser = require('./verifyUser.js');

//create a server object:
http.createServer(function (req, res) {

    const {headers, method, url} = req;

    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();

        obj = JSON.parse(body);
        var request = obj.request;
        switch (request) {
            case "signup":
                console.log("Request: signup ===============================================");
                insertUser(obj);
                break;
            case "signin":
                console.log("Request: signin ===============================================");
                console.log(await  verifyUser(obj));
                if(await verifyUser(obj)) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader("Content-Type", "application/json");
                    res.write(JSON.stringify({"result": true }))
                } else {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader("Content-Type", "application/json");
                    res.write(JSON.stringify({"result": false }))
                }
                res.end();
                break;
            case "Radar":
                console.log("Request: radar ================================================");
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
            default:
                console.log("Bad request ===================================================");
                break;
        }
    });
}).listen(8080); //the server object listens on port 8080

function getPlayerPositionRadar(jsonData,res) {

    var playerId = jsonData.playerId;
    var playerLongitude = jsonData.longitude;
    var playerLatitude = jsonData.latitude;
    var sendSignal = jsonData.sendSignal;


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        console.log("Insert position of player with id: "+playerId);

        var query = { idPlayer:playerId };
        var newvalues = { $set: {longitude : playerLongitude, latitude : playerLatitude } };
        dbo.collection("testPlayers").updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("Update DB for player positions with id: "+playerId+ ", result query: "+res);
        });

        console.log("Get Players nearby(RADAR)!")

        var query = {};
        dbo.collection("testPlayers").find(query).toArray(function (err, result) {

            if (err){
                res.write("No player positions available");
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Content-Type", "ERROR");
                throw err;
            } else {
                db.close();

                // Filter players on distance
                //var resultFilter = filterPlayers(result, playerLongitude, playerLatitude, range);

                // Return Result -=-=-=-=-=-=-=-=-
                res.setHeader('Access-Control-Allow-Origin', '*');
                console.log("Result: "+JSON.stringify(result))
                res.write(JSON.stringify(result)); //write a response to the client
                res.end(); //end the response
                // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

            }
        });

        // update database after signal
        var myquery = { idPlayer: playerId };
        var newvalues = { $set: {sendSignal: "falseSignal", dataSignal: null} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("sendSignal to false for player with id: "+playerId+", result query: "+ res);
            db.close();
        });

    });
}
function sendSignal(obj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        var myquery = { idPlayer: obj.playerId };
        var newvalues = { $set: {sendSignal : obj.sendSignal, dataSignal: obj.dataSignal} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("Signal send to player with id: "+obj.playerId+", result query: "+ res);
            db.close();
        });
    });
}
function fight(obj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        var myquery = { idPlayer: obj.playerId };
        var newvalues = { $set: {enemyPlayerId : obj.enemyPlayerId} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });

        console.log("==============>"+obj.idPlayer+"================>"+obj.enemyPlayerId);

        var myquery = { idPlayer: obj.enemyPlayerId };
        var newvalues = { $set: {enemyPlayerId : obj.idPlayer} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });

        console.log("Enemies are created");
        db.close();

    });
}

