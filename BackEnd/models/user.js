// nome, email, filiação (estudante, docente, curso, departamento, ...), nível (administrador, produtor ou consumidor), dataRegisto (registo na plataforma), dataUltimoAcesso, password, outros campos que julgue necessários...

const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    email: String,
    filiacao: String, // estudante, docente, curso, departamento, 
    nivel: String, // administrador, produtor ou consumidor
    dataRegisto: String, // registo na plataforma
    dataUltimoAcesso: String,
    password: String,
});

module.exports = mongoose.model('lista',userSchema)