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
    var group = [0]
    u.groups = group
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
    return User.updateOne({ username: user }, { $set: info })
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

//remove group from all users that were on the group (when deleting group)
module.exports.removeGroupUsers = groupId => {
    return User.updateMany(
        { groups: groupId }, 
        { $pull: { groups: groupId } }
    )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}


//Remove file id from favorites - all users
module.exports.removeFavoritesUsers = file => {
    return User.updateMany(
        { favorites: file }, 
        { $pull: { favorites: file } }
    )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//Remove file from submissions of file's creator
module.exports.removeSubmission = (user, file) => {
    return User.updateOne({ username: user }, { $pull: { submissions: file } })
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

//when removing user from group
module.exports.removeGroupUser = (user, group) => {
    return User.updateOne({ username: user }, 
    { $pull: { groups: group } })
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//add to favorites
module.exports.addFavorite= (user, file) => {
    return User.updateOne({ username: user }, 
    { $push: { favorites: file } })
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

// remove from favorites
module.exports.removeFavorite = (user, file) => {
    return User.updateOne({ username: user }, 
    { $pull: { favorites: file } })
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

//get favorites
module.exports.getFavorites = (user) => {
    return User.findOne({ username: user }, 
    { favorites: 1 })
    .then(dados => {
        return dados.favorites
    })
    .catch(erro => {
        return erro
    })
}


module.exports.getUserReset = (token) => {
    return User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.updateUserReset = (email, resetPasswordToken, resetPasswordExpires) => {
    return User.findOneAndUpdate(
        { email: email },
        { 
          resetPasswordToken: resetPasswordToken, 
          resetPasswordExpires: resetPasswordExpires 
        },
        { new: true } // This option returns the updated document
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}


 
