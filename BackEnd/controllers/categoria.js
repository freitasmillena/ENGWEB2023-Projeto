var Categoria = require('../models/categoria')

module.exports.getCategorias = () => {
    return Categoria.find().sort({name: 1})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.addCategoria = l => {
    return Categoria.create(l)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}