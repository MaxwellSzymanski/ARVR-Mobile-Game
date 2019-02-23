const User = require('./userModel.js');
const fs = require('fs');

let image = fs.readFileSync('../../Server tests/image.png');

const mongoose = require('mongoose');
mongoose.connect('mongodb://team12:mongoDBteam12@35.241.198.186:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb',  { useNewUrlParser: true });

const pass = "test";

const test = new User({
    name: "test123",
    email: "test123@test.com",
    password: pass,
    image: image
});
test.save();

setTimeout( async () => {
    console.log("\n" +  await test.checkPassword(pass) + "\n");
}, 500);