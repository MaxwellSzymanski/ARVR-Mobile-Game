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

        obj = JSON.stringify(body);

        getPlayerPositionRadar(obj,res);

    });

}).listen(8080); //the server object listens on port 8080

function getPlayerPositionRadar(jsonData,res) {

        var playerId = jsonData.playerId;

        var range = 100;

        var playerLongitude = jsonData.Longitude;
        var playerLatitude = jsonData.Latitude;

        console.log("Get Players nearby(RADAR)!")

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("testPlayers");
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
        });
}
