const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    surname: String,
    username: String,
    email: String,
    dataRegisto: String, // registo na plataforma
    dataUltimoAcesso: String,
    password: String,
    groups: [String],
    submissions: [String]
});

module.exports = mongoose.model('user',userSchema)