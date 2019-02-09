var http = require('http');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var frequency = 4000;

//create a server object:
http.createServer(function (req, res) {

    const { headers, method, url } = req;
    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        obj = JSON.parse(body);
        var request = obj.request;
        switch(request) {
            case "Radar":
                console.log("Request: radar ================================================");
                getPlayerPositionRadar(obj,res);
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
    });

}).listen(8080); //the server object listens on port 8080

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
        var newvalues = { $set: {sendSignal: null, dataSignal: null} };
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
            console.log(res+ "result fight")
        });
        db.close();

    });

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        var myquery = { idPlayer: obj.enemyPlayerId };
        var newvalues = { $set: {enemyPlayerId : obj.playerId} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(res+ "result fight")
        });

        db.close();

    });

    console.log("Enemies are created");



}

