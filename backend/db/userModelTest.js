const User = require('./userModel.js');
const fs = require('fs');

let image = fs.readFileSync('../../Server tests/image.png');

const mongoose = require('mongoose');
mongoose.connect('mongodb://team12:mongoDBteam12@35.241.198.186:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });

const pass = "password";
const name = "test123456789";
const email = "test123456789@test.com";

const test = new User({
    name: name,
    email: email,
    password: pass,
    image: image
});
test.save();


setTimeout( async () => {
    User.findOne({email: email}, async function(error, result) {
        console.log(result.health);
        result.health = 15.145;
        result.save();
    })
}, 1000);

setTimeout( async () => {
    User.findOne({email: email}, async function(error, result) {
        console.log(result.health);
        result.health = result.health + 0.49;
        result.save();
    })
}, 2000);

setTimeout( async () => {
    User.findOne({email: email}, async function(error, result) {
        console.log(result.health);
    })
}, 3000);