
//Create DataBase
// Bron: https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;


    var idPlayer1 = "1";
    var longitudePlayer1 = 4.361721;
    var latitudePlayer1 = 50.850346;

    var idPlayer2 = "2";
    var longitudePlayer2 = 4.350434;
    var latitudePlayer2 = 50.850892;

    var dbo = db.db("testPlayers");
    var myPlayer1 = { idPlayer: idPlayer1, longitude: longitudePlayer1,latitude: latitudePlayer1 };
    var myPlayer2 = { idPlayer: idPlayer2,longitude: longitudePlayer2,latitude: latitudePlayer2 };
    var firstPlayer = { firstPlayer:idPlayer1 };


    dbo.collection("testPlayers").insertOne(myPlayer1, function(err, res) {
        if (err) throw err;
        console.log("Player 1 inserted");
    });


    dbo.collection("testPlayers").insertOne(myPlayer2, function(err, res) {
        if (err) throw err;
        console.log("Player 2 inserted");
    });

    dbo.collection("testPlayers").insertOne(firstPlayer, function(err, res) {
        if (err) throw err;
        console.log("Player 2 inserted");
    });

    db.close();
});