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

module.exports.listRecursosUser = (username,groups, sort) => {
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
        sort = {"size": -1}
    else
        sort = {"created": -1}

    return Recurso.find({ "$or": [{ "creator": username, "available_for.users": username }, { "available_for.groups": {"$in":groups} }] }).sort(sort).skip(0).limit(10)
      .then((dados) => {
        console.log(dados)
          return dados;
        })
        .catch((erro) => {
            return erro;
        });
  };

//GET /api/recursos/:id
module.exports.getRecurso = (id, username, groups) => {
    return Recurso.findOne({"$and": [{_id: id},{ "$or": [{ "creator": username, "available_for.users": username }, { "available_for.groups": {"$in":groups} }] }]})
    .then(dados => {
        return dados
    })
    .catch(erro => {
        return erro
    })
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
module.exports.deleteRecurso = (idUser,id) => {
    if (l._id == idUser) {
        return Recurso.collection.deleteOne({_id: id})
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
    }
    else{
        console.log("Não é possivel eliminar o recurso de outro utilizador")
        return "Não é possivel eliminar o recurso de outro utilizador"
    }
}

//GET /api/recursos/tipos
module.exports.tipos = () => {
    return Recurso.distinct("recursos.tipo")
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

//GET /api/recursos/tipos/:tipo/
module.exports.recsByTipo = (username,groups,tipo, sort) => {
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
        sort = {"size": -1}
    else
        sort = {"created": -1}

    return Recurso.find(
        {   "$or": 
            [     
                { "creator": username, "available_for.users": username },     
                { "available_for.groups": { "$in": groups } }  
            ],   
            "type": { $regex: tipo, $options: "i" } }
        ).sort(sort).skip(0).limit(10);
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