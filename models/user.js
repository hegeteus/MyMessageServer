const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    googleID: {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);
