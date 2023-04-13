var Recurso = require('../models/recurso')

// lista de recursos
module.exports.list = () => {
    return Recurso.find().sort({data: -1})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })

}

//GET /api/Recursos/:id
module.exports.getRecurso = id => {
    return Recurso.findOne({_id: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//POST /api/Recursos
module.exports.addRecurso = l => {
    return Recurso.collection.insertOne(l)
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//PUT /recursos/:id
module.exports.updateRecurso = l => {
    return Recurso.updateOne({_id: l._id}, l)
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//DELETE /recursos/:id
module.exports.deleteRecurso = id => {
    return Recurso.collection.deleteOne({_id: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

