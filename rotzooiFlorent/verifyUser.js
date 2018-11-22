const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";

const bcrypt = require('bcrypt');

module.exports = function (userData) {
   return new Promise(resolve => {
       MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
           if (err) throw err;

           const dbo = db.db("userdb");
           dbo.collection("users").findOne({email: userData.email}, function (err, result) {
               if (err) throw err;
               if (result === {} || result === null) {
                   console.log("No account linked to the given email.");
                   db.close();
                   resolve(false);
               } else {
                   bcrypt.compare(userData.password, result.password, function (err, res) {
                       if (err) throw err;
                       db.close();
                       resolve(res);
                   });
               }
           });
       });
   });
};