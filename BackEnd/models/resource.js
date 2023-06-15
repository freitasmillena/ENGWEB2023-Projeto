const mongoose = require('mongoose');

var availableSchema = new mongoose.Schema({
    groups: [String],
    users: [String]
});

var commentSchema = new mongoose.Schema({
    user: String,
    comment: String
});

var resourceSchema = new mongoose.Schema({
    _id: String,
    size: Number,
    type: String,
    path: String,
    title: String,
    description: String,
    created: String,
    modified: String, 
    creator: String,
    available_for: availableSchema,
    comments: [commentSchema],
});

module.exports = mongoose.model('resource',resourceSchema)