const mongoose = require('mongoose');

var categoriaSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('categoria',categoriaSchema)