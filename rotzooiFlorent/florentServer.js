var http = require('http');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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
        var request = obj.Request;
        switch(request) {
            case "Radar":
                console.log("Request: radar ================================================");
                getPlayerPositionRadar(obj,res);
                break;
            case "fixedSignal":
                console.log("Request: fixedSignal ==========================================");
                sendFixedSignal(obj);
                break;
            default:
                console.log("Bad request ===================================================");
        }
    });

}).listen(8080); //the server object listens on port 8080

function getPlayerPositionRadar(jsonData,res) {

    var playerId = jsonData.playerId;
    var playerLongitude = jsonData.Longitude;
    var playerLatitude = jsonData.Latitude;
    var fixedSignal = jsonData.fixedSignal;


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        console.log("Insert position of player with id: "+playerId);

        var query = { idPlayer: playerId };
        var newvalues = { $set: {Longitude : playerLongitude, Latitude : playerLatitude } };
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

        // update database after fixed signal
        if (fixedSignal === 'true') {

            var myquery = { idPlayer: playerId };
            var newvalues = { $set: {fixedSignal: "false"} };
            dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("fixedSignal to false for player with id: "+playerId+", result query: "+ res);
                db.close();
            });
        }
    });
}
function sendFixedSignal(obj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testPlayers");

        var myquery = { idPlayer: obj.playerId };
        var newvalues = { $set: {fixedSignal : "true"} };
        dbo.collection("testPlayers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("fixedSignal send to player with id: "+obj.playerId+", result query: "+ res);
            db.close();
        });
    });
}