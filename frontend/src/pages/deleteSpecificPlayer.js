
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var idPlayerDB = "1";

    var dbo = db.db("testPlayers");
    var myquery = { idPlayer: idPlayerDB };
    dbo.collection("testPlayers").deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("player with id: "+idPlayerDB+" -> deleted from database");
        db.close();
    });

    var idPlayerDB = "2";

    var dbo = db.db("testPlayers");
    var myquery = { idPlayer: idPlayerDB };
    dbo.collection("testPlayers").deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("player with id: "+idPlayerDB+" -> deleted from database");
        db.close();
    });
});