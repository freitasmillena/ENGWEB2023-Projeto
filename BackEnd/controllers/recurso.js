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

module.exports.listRecursosUser = (username, groups) => {
    
    return Recurso.find().sort({ dataCriacao: -1 })
      .then((dados) => {
        // Filter the resources based on user access
        const filteredRecursos = dados.filter((recurso) => {
          
          const publicAccess = recurso.visibility === 'public';
                    
          if(publicAccess) return true;
          else {
            
            // Check if the username is in available_for.users array
            const userAccess = recurso.available_for.users.includes(username) || recurso.creator === username;
            
            if(userAccess) return true;
            else {
            // Check if any of the user's groups is in available_for.groups array
            const groupAccess = recurso.available_for.groups.some((group) =>
              groups.includes(group)
            );

            return groupAccess;
            }

            
          }
          
        });
        
        return filteredRecursos;
      })
      .catch((erro) => {
        return erro;
      });
  };

//GET /api/recursos/:id
module.exports.getRecurso = (id, username, groups) => {
    return Recurso.findOne({_id: id})
    .then((recurso) => {
        
          
          const publicAccess = recurso.visibility === 'public';
                    
          if(publicAccess) return recurso;
          else {
            
            // Check if the username is in available_for.users array
            const userAccess = recurso.available_for.users.includes(username) || recurso.creator === username;
            
            if(userAccess) return recurso;
            else {
                // Check if any of the user's groups is in available_for.groups array
                const groupAccess = recurso.available_for.groups.some((group) =>
                  groups.includes(group)
                );

                if(groupAccess) return recurso;
                else return NULL;

            
            }

            
          }      
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

//GET /api/recursos/tipos/:id/recursos
module.exports.recsByTipo = (id) => {
    return Recurso.aggregate([{$unwind: "$recursos"}, {$match: {"recursos.tipo": id}}, {$project: {"recursos.titulo":1, _id:0}}])
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
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