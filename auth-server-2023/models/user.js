const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    occupation: String,
    level: String,
    dataUltimoAcesso: String,
    groups: [Number], //id groups
    submissions: [Number], //id files
    favorites: [Number], //id files
    dataRegisto: String
  });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)

