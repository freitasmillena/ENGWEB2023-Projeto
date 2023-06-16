// Controlador para o modelo User

var User = require('../models/user')

// Devolve a lista de Users
module.exports.list = () => {
    return User
            .find()
            .sort('name')
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getUser = user => {
    return User.findOne({username:user})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.searchUser = pattern => {
    return User.find({ username: { $regex: pattern, $options: 'i' } })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getUsername = user => {
    return User.findOne({username:user})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getUserEmail = e => {
    return User.findOne({email:e})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getUserGroups = e => {
    return User.findOne({username:e})
            .then(resposta => {
                
                return resposta.groups
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addUser = u => {
    return User.create(u)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateSubmissions = (user, sub) => {
    return User.updateOne({ username: user }, { $push: { submissions: sub } })
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateGroups = (user, group) => {
    return User.updateOne({ username: user }, { $push: { groups: group } })
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateUser = (user, info) => {
    return User.updateOne({username:user}, info)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

/* module.exports.updateUserStatus = (id, status) => {
    return User.updateOne({_id:id}, {active: status})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
} */

module.exports.updateUserPassword = (user, pwd) => {
    return User.updateOne({username:user}, pwd)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteUser = user => {
    return User.deleteOne({username:user})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}
 
