var User = require('../models/user')
var Recurso = require('../models/recurso')

// lista de users
module.exports.list = () => {
    return User.find().sort({data: -1})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })

}

//GET /api/Users/:id
module.exports.getUser = id => {
    return User.findOne({_id: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//POST /api/Users
module.exports.addUser = l => {
    return User.collection.insertOne(l)
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//PUT /users/:id
module.exports.updateUser = l => {
    return User.updateOne({_id: l._id}, l)
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//DELETE /users/:id
module.exports.deleteUser = id => {
    return User.collection.deleteOne({_id: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//GET /api/Users/:id/recursos
module.exports.getRecursos = id => {
    return Recurso.find({autor: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}
