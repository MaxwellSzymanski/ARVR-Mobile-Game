const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";

MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) throw err;

    const dbo = db.db("userDB");
    dbo.collection("users").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});