const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secret = require('./config');

const Schema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        // index: true         // index to optimise queries that search on username
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: /\S+@\S+\.\S+/,
        // index: true         // index to optimise queries that search on email
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String        // path to file
    },
}, {timestamps: true});

Schema.plugin(uniqueValidator, {message: 'already taken'});

Schema.pre('save', async function(){
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
});

Schema.methods.checkPassword = function(password) {
    bcrypt.compare(password, this.passwordHash, function (err, res) {
        if (err) throw err;
        return res;
    });
};

Schema.methods.createToken = function() {
    const today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        id: this._id,
        name: this.name,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

Schema.methods.getUserData = function() {
    return {
        name: this.name,
        email: this.email,
        token: this.createToken(),
        image: this.image
    };
};

module.exports = mongoose.model('User', Schema);