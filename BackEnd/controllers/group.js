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

module.exports.addGroup = l => {
    return Group.find({}, {_id: 1})
        .then(qtd => {
            
            //ordenar
            qtd.sort((a, b) => b._id - a._id);
            var next
            if (qtd.length == 0) next = 0
            else next = qtd[0]._id
            
            l._id = next + 1
            
            
            return Group.create(l)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getGroup = id => {
    return Group.findOne({_id: id})
    .then(dados => {
        return dados
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