// tipo, título, subtítulo (opcional), dataCriação, dataRegisto (entrada no sistema), visibilidade (público: todos podem ver e descarregar, privado: apenas disponível para administradores e seu produtor), produtor/autor, ...


const mongoose = require('mongoose');

var recursoSchema = new mongoose.Schema({
    _id: String,
    tipo: String,
    titulo: String,
    subtitulo: String, // optional
    tema: String,
    dataCriacao: String,
    dataRegisto: String, // entrada no sistema
    visibilidade: Boolean, // público: todos podem ver e descarregar, privado: apenas disponível para administradores e seu produtor
    autor: String,
});

module.exports = mongoose.model('recurso',recursoSchema)