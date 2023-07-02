var Recurso = require('../models/recurso')

// lista de recursos
module.exports.listRecursos = () => {
    return Recurso.find().sort({dataCriacao: -1})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })

}

module.exports.recsByGroups = (groups, sort,) => {
    if (sort === "dateasc")
        sort = { "created": 1 }
    else if (sort === "datedesc")
        sort = { "created": -1 }
    else if (sort === "titleasc")
        sort = { "title": 1 }
    else if (sort === "titledesc")
        sort = { "title": -1 }
    else if (sort === "sizeasc")
        sort = { "size": 1 }
    else if (sort === "sizedesc")
        sort = { "size": -1 }
    else if (sort === "favsasc")
        sort = { "favs": 1 }
    else if (sort === "favsdesc")
        sort = { "favs": -1 }
    else
        sort = { "created": -1 }

    return Recurso.find({ "available_for.groups": { "$in": groups } }).sort(sort).limit(10)
}


module.exports.listRecursosGroup = (group) => {
    return Recurso.find({ "available_for.groups": {"$in":group} })
    .then((dados) => {
      console.log(dados)
        return dados;
      })
      .catch((erro) => {
          return erro;
      });
}

module.exports.listRecursosUser = (username,groups, sort,page,max, level) => {
    if (sort === "dateasc" )
        sort = {"created": 1}
    else if (sort === "datedesc")
        sort = {"created": -1}
    else if (sort === "titleasc")
        sort = {"title": 1}
    else if (sort === "titledesc")
        sort = {"title": -1}
    else if (sort === "sizeasc")
        sort = {"size": 1}
    else if (sort === "sizedesc")
        sort = { "size": -1 }
    else if (sort === "favsasc")
        sort = { "favs": 1 }
    else if (sort === "favsdesc")
        sort = { "favs": -1 }
    else
        sort = {"created": -1}

    if (level != 'admin'){
        return Recurso.find({ "$or": [{ "creator": username}, {"available_for.users": {"$in":username} }, { "available_for.groups": {"$in":groups} }] }).sort(sort).skip(page*max).limit(max)
          .then((dados) => {
            console.log(dados)
              return dados;
            })
            .catch((erro) => {
                return erro;
            });
    }else{
        return Recurso.find().sort(sort).skip(page*max).limit(max)
          .then((dados) => {
            console.log(dados)
              return dados;
            })
            .catch((erro) => {
                return erro;
            });
    }
  };

//GET /api/recursos/:id
module.exports.getRecurso = (id, username, groups, level) => {
    if (level != 'admin'){
        return Recurso.findOne({"$and": [{_id: id},{ "$or": [{ "creator": username}, {"available_for.users": {"$in":username} }, { "available_for.groups": {"$in":groups} }] }]})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
    }else{
        return Recurso.findOne({_id: id})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
    }
}

//POST /api/recursos
module.exports.addRecurso = l => {
    return Recurso.find({}, {_id: 1})
        .then(qtd => {
            
            //ordenar
            qtd.sort((a, b) => b._id - a._id);
            var next
            if (qtd.length == 0) next = 0
            else next = qtd[0]._id
            
            l._id = next + 1
            
            
            return Recurso.create(l)
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

//PUT api/:idUser/recursos/:id
module.exports.updateRecurso = (idUser,l) => {
    if (l._id == idUser) {
        return Recurso.updateOne({_id: l._id}, l)
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
    }
    else {
        console.log("Não é possivel alterar o recurso de outro utilizador")
        return "Não é possivel alterar o recurso de outro utilizador"
    }
}

//DELETE api/:idUser/recursos/:id
module.exports.deleteRecurso = (id) => {
    
        return Recurso.deleteOne({_id: id})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
    
}

//GET /api/recursos/tipos
module.exports.tipos = () => {
    return Recurso.distinct("type")
            .then(resposta => {
                //filter list to remove all values that contain '/'
                resposta = resposta.filter(function (el) {
                    return !el.includes("/");
                });
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

//GET /api/recursos/tipos/:tipo/
module.exports.recsByTipo = (username,groups,tipo, sort, level) => {
    if (sort === "dateasc" )
        sort = {"created": 1}
    else if (sort === "datedesc")
        sort = {"created": -1}
    else if (sort === "titleasc")
        sort = {"title": 1}
    else if (sort === "titledesc")
        sort = {"title": -1}
    else if (sort === "sizeasc")
        sort = {"size": 1}
    else if (sort === "sizedesc")
        sort = { "size": -1 }
    else if (sort === "favsasc")
        sort = { "favs": 1 }
    else if (sort === "favsdesc")
        sort = { "favs": -1 }
    else
        sort = {"created": -1}

    if (level != 'admin'){
        return Recurso.find(
            {   "$or": 
                [     
                    { "creator": username, "available_for.users": username },     
                    { "available_for.groups": { "$in": groups } }  
                ],   
                "type": tipo}
            ).sort(sort).skip(0).limit(10);
    }else{
        return Recurso.find({"type": tipo}).sort(sort).skip(0).limit(10);
    }
}

//GET /api/recursos/:categSelected:condition:categValue
module.exports.recsCond = (username,groups,categSelected,condition,categValue, sort, level) => {
    if (sort === "dateasc" )
        sort = {"created": 1}
    else if (sort === "datedesc")
        sort = {"created": -1}
    else if (sort === "titleasc")
        sort = {"title": 1}
    else if (sort === "titledesc")
        sort = {"title": -1}
    else if (sort === "sizeasc")
        sort = {"size": 1}
    else if (sort === "sizedesc")
        sort = { "size": -1 }
    else if (sort === "favsasc")
        sort = { "favs": 1 }
    else if (sort === "favsdesc")
        sort = { "favs": -1 }
    else
        sort = {"created": -1}

    // db.recursos.find({"title": { "$regex": "READM" }}).sort({"created": -1}).skip(0).limit(10);

    if (condition === "equals")
        category = categValue
    else if (condition === "greater")
        category = { "$gt": categValue}
    else if (condition === "less")
        category = { "$lt": categValue}
    else if (condition === "greaterOrEqual")
        category = { "$gte": categValue }
    else if (condition === "lessOrEqual")
        category = { "$lte": categValue }
    else if (condition === "notEqual")
        category = { "$ne": categValue}
    else if (condition === "contains")
        category = { "$regex": categValue}
    else if (condition === "notContains")
        category = { "$not": { "$regex": categValue } }
    else if (condition === "startsWith")
        category = { "$regex": "^" + categValue}
    else if (condition === "endsWith")
        category = { "$regex": categValue + "$" }
    else
        category = categSelected
    console.log("HERE "+categSelected)
    console.log(category)
    console.log("HERE "+username)

    categSelected = categSelected

    if (level != 'admin'){
        console.log("{   \"$or\": [     { \"creator\": "+username+", \"available_for.users\": "+username+" },     { \"available_for.groups\": { \"$in\": "+groups+" } }   ],   "+categSelected+": "+ JSON.stringify(category)+"}")
        return Recurso.find(
            {   "$or": 
                [     
                    { "creator": username, "available_for.users": username },     
                    { "available_for.groups": { "$in": groups } }  
                ],   
                [categSelected]: category}
            ).sort(sort).skip(0).limit(10);
    }else{
        return Recurso.find({categSelected: category}).sort(sort).skip(0).limit(10);
    }
}


//GET /api/recursos/categorias/:categ/
module.exports.recsByCateg = (username,groups,categ, sort, level) => {
    if (sort === "dateasc" )
        sort = {"created": 1}
    else if (sort === "datedesc")
        sort = {"created": -1}
    else if (sort === "titleasc")
        sort = {"title": 1}
    else if (sort === "titledesc")
        sort = {"title": -1}
    else if (sort === "sizeasc")
        sort = {"size": 1}
    else if (sort === "sizedesc")
        sort = { "size": -1 }
    else if (sort === "favsasc")
        sort = { "favs": 1 }
    else if (sort === "favsdesc")
        sort = { "favs": -1 }
    else
        sort = {"created": -1}

    if (level != 'admin'){
        return Recurso.find(
            {   "$or": 
                [     
                    { "creator": username, "available_for.users": username },     
                    { "available_for.groups": { "$in": groups } }  
                ],   
                "category": categ }
            ).sort(sort).skip(0).limit(10);
    }else{
        return Recurso.find({"category": categ}).sort(sort).skip(0).limit(10);
    }

}


//GET /api/users/:id/recursos
module.exports.getRecursos = id => {
    return Recurso.find({autor: id})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}


module.exports.removeGroupAvailable = group => {
    return Recurso.updateMany({ "available_for.groups": group }, 
    { $pull: { "available_for.groups": group } })
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.addComment = (file, comment) => {
    return Recurso.findOne({_id: file}, {comments: 1})
        .then(recurso => {
           var commentsList = recurso.comments
           console.log("comments: " + commentsList)
           var maxId
           if(commentsList.length > 0){
            var idList = commentsList.map(item => item._id);
            idList.sort((a, b) => b - a);
            maxId = idList[0]
           }
           else {
            maxId = 0
           }

           console.log("maxId: " + maxId)
           comment._id = maxId + 1

           return Recurso.findOneAndUpdate(
            { _id: file },
            { $push: { comments: comment } },
            { new: true }
          )
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


  
module.exports.removeComment = (file, comment) => {
    return Recurso.findOneAndUpdate(
        { _id: file },
        { $pull: { comments: { _id: comment } } },
        { new: true }
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.updateComment = (file, comment) => {
    return Recurso.findOneAndUpdate(
        { _id: file, 'comments._id': comment._id },
        { $set: { 'comments.$.comment': comment.comment, 'comments.$.created': comment.created  } },
        { new: true }
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.addFavorite = (file) => {
    return Recurso.findOneAndUpdate(
        { _id: file },
        { $inc: { favs: 1 } },
        { new: true }
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.removeFavorite = (file) => {
    return Recurso.findOneAndUpdate(
        { _id: file },
        { $inc: { favs: -1 } },
        { new: true }
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}

module.exports.updateFile = (file, updates) => {
    return Recurso.updateOne(
        { _id: file },
        { $set: updates }
      )
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
}


