const mongoose = require('mongoose');

var availableSchema = new mongoose.Schema(
    {
      groups: [Number],
      users: [String]
    },
    { _id: false } // Set _id option to false
  );

var commentSchema = new mongoose.Schema({
    user: String,
    comment: String
});

var recursoSchema = new mongoose.Schema({
    _id: Number,
    size: String,
    name: String,
    type: String,
    path: String,
    title: String,
    description: String,
    created: String,
    modified: String, 
    creator: String,
    visibility: String,
    available_for: availableSchema,
    comments: [commentSchema],
    category: String
});

module.exports = mongoose.model('recurso',recursoSchema)