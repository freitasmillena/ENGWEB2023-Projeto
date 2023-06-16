var Group = require('../models/group')

module.exports.searchGroup = pattern => {
    return Group.find({ name: { $regex: pattern, $options: 'i' } })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getGroupsUser = username => {
    //return the id of all groups that the user is in participants or owner
    return Group.find({ "$or": [{ "owner": username }, {"participants" :{"$in": username }}] })
        .then(resposta => {
            // add the element [0] to the array
            var groups = []
            resposta.forEach(element => {
                groups.push(element._id)
                }
            )
            groups.push(0)
            return groups
        })
        .catch(erro => {
            return erro
        })
}


/* // lista de     
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
 */