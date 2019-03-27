const mongoose = require('mongoose');

// ========================================== IMAGE

const ImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    descriptors: {
        type: Object,
        // required: true
    },
    keypoints: {
        type: Object,
        // required: true
    }

}, {timestamps: true});

ImageSchema.pre('save', function(next) {
    next();
});


// ========================================== GROUP

const GroupSchema = new mongoose.Schema({
    images: {
        type: [ImageSchema],
    },
    location: {
        type: [Number],
        required: true
    }
}, {timestamps: true});

GroupSchema.pre('save', function(next) {
    next();
});

GroupSchema.methods.addPhoto = function(missionImage) {
    if (this.group)
        this.group.push(missionImage);
    else
        this.group = [missionImage, ];
};

GroupSchema.methods.distanceBetween = function(coordinates) {
    if (coordinates.length < 2)
        return 0;
    const lat1 = coordinates[0],
        lon1 = coordinates[1],
        lat2 = this.location[0],
        lon2 = this.location[1];
    var x = degreesToRadians(lon2-lon1) * Math.cos(degreesToRadians(lat2+lat1)/2);
    var y = degreesToRadians(lat2-lat1);
    var d = Math.sqrt(x*x + y*y) * 6371;
    return d * 1000; // * 1000 (answer in meters)
};

function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}


exports.MissionImage = mongoose.model('MissionImage', ImageSchema);
exports.MissionGroup = mongoose.model('MissionGroup', GroupSchema);