const mongoose = require('mongoose');

const repostSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 280
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Repost = mongoose.model('Repost', repostSchema);

module.exports = Repost;