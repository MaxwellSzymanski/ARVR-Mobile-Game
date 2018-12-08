const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secret = require('./config.js');

const Schema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        index: true         // index to optimise queries that search on username
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: /\S+@\S+\.\S+/,
        index: true         // index to optimise queries that search on email
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featureVector: {
        type: Object,
        // required: true
    }
}, {timestamps: true});

Schema.plugin(uniqueValidator, {message: 'already taken'});

Schema.pre('save', async function(){
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
});

Schema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

Schema.methods.createToken = function() {
    let exp = new Date();
    const days = exp.getDate() + 1;
    exp.setDate(days);

    return jwt.sign({
        id: this._id,
        name: this.name,
        exp: parseInt(exp.getDate())
    }, secret);
};

Schema.methods.checkToken = function(token) {
    return this.name === token.name;
};

Schema.methods.getUserData = function() {
    return {
        name: this.name,
        email: this.email,
        image: this.image
    };
};

module.exports = mongoose.model('User', Schema);