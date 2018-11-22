// Database model of an active game

const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    playerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    location: {
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
    },
}, {timestamps: true});

Schema.methods.getLocationJSON = function() {
    return JSON.stringify({
        longitude: this.longitude,
        latitude: this.latitude,
    })
};

module.exports = mongoose.model('ActivePlayer', Schema);