const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    },
    imageURL: {
        type: String,
        default: "",
        required: false
    }
},{timestamps: true});

const messageSchema = new Schema({
    author: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'useless'
    },
    imageURL: {
        type: String,
        default: "",
        required: false
    },
    comments: [commentSchema]
},{
    timestamps: true
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
