const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";

const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = function (userData) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;

        if (!(userData.email &&
            userData.name &&
            userData.password)) {
            console.log("Missing data.");
            return;
        }

        const dbo = db.db("userdb");

        dbo.collection("users").findOne({email: userData.email, name: userData.name}, function (err, result) {
            if (err) throw err;
            if (result !== {} && result !== null) {
                console.log("Username or email already exists.");
                db.close();
            } else {
                bcrypt.hash(userData.password, saltRounds, function(err, hash) {
                    const dataToStore = { email: userData.email,
                                        password: hash,
                                        name: userData.name};
                    console.log(hash);
                    dbo.collection("users").insertOne(dataToStore, function (err, res) {
                        if (err) {
                            console.log("Error with following userdata:\n" + userData);
                            db.close();
                            throw err;
                        }
                        console.log("User inserted: \n" + userData);
                        db.close();
                    });
                });
            }

        });
    });
};



