const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    level: String,
    dataUltimoAcesso: String,
    groups: [String],
    submissions: [String],
    favorites: [String],
    dataRegisto: String
  });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)

