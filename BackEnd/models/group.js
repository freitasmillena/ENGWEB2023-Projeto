const mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    _id: String,
    name: String,
    owner: String,
    accessNivel: String,
    participants: [String]
});

module.exports = mongoose.model('group',groupSchema)