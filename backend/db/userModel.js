const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secret = require('./config.js');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gameofwolves12@gmail.com',
        pass: 'peno12perseus'
    }
});

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
    verified: {
        type: Boolean,
        default: false
    },
    verifCode: {
        type: Number
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
    },
    attack: {
        type: Number,
        default: 100
    },
    defence: {
        type: Number,
        default: 100
    },
    health: {
        type: Number,
        default: 100
    },
    level: {
        type: Number,
        default: 1
    },
    experience: {
        type: Number,
        default: 0
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
    let exp = 1;            // Number of days before expiry
    exp *= 60 * 60 * 24;    // days * 60 sec * 60 min * 24 h

    return jwt.sign({
        id: this._id,
        name: this.name,
        // exp: parseInt(exp)
    }, secret, {expiresIn : exp});
};

Schema.methods.checkToken = function(token) {
    return this.name === token.name;
};

Schema.methods.getUserData = function() {
    return {
        name: this.name,
        attack: this.attack,
        defence: this.defence,
        health: this.health,
        level: this.level,
        experience: this.experience
    };
};

Schema.methods.sendVerifMail = function() {
    this.verifCode = Math.trunc(100000 + 899998*(Math.random()));
    this.save();

    let message = this.name + ",\n\n\nUse the following code to activate your account:\n\n" +
        this.verifCode.toString() + "\n\n\nThe Game of Wolves team";

    const options = {
        from: 'Game Of Wolves',
        to: this.email,
        subject: 'Verify your e-mail',
        text: message
    };

    transporter.sendMail(options, function(error, res){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + res.response);
        }
    });
};

Schema.methods.verify = function(code) {
    if(this.verifCode === code) {
        this.verified = true;
        this.save();
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', Schema);