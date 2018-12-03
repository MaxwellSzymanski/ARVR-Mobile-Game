// Database model of an active game

const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    playerid: {
        type: String,
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
    sendSignal: {
        type: String,
        required: false,
    },
    dataSignal: {
        type: Object,
        required: false,
    },
    enemyPlayerId: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        expires: 30,        // this document is removed if it is not updated each 30 seconds
        default: Date.now()
    },
});

Schema.methods.getLocationJSON = function() {
    return JSON.stringify({
        longitude: this.longitude,
        latitude: this.latitude,
    })
};

module.exports = mongoose.model('ActivePlayer', Schema);