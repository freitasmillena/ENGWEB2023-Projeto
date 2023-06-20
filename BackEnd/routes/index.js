var express = require('express');
const { decode } = require('jsonwebtoken');
var router = express.Router();
var Group = require('../controllers/group');
var Recurso = require('../controllers/recurso');
var Categoria = require('../controllers/categoria');
var date = new Date().toISOString().substring(0, 16);
var jwt = require('jsonwebtoken')
var axios = require('axios')


// /recursos/:categSelected:condition:categValue'
router.get('/api/recursos/cond/:val', async function (req, res) {
  //decode the token
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var level = decoded.level
  var groups = await Group.getGroupsUser(decoded.username)

  // check if there is a sort query
  if (req.query.sort) {
    var sort = req.query.sort
  } else {
    var sort = "dateasc"
  }
  console.log("sort: " + sort)

  // split the req.query.val into the 3 parts
  var vals = req.params.val.split("_")

  Recurso.recsCond(decoded.username, groups, vals[0], vals[1], vals[2] , sort, level)
    .then(recursos => {
      console.log("recursos: " + recursos)
      res.jsonp(recursos)
    })
    
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção da user de recursos" })
    })
});

/* GET recursos */
router.get('/api/recursos', async function (req, res, next) {

  //decode the token
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var level = decoded.level
  var groups = await Group.getGroupsUser(decoded.username)

  // check if there is a sort query
  if (req.query.sort) {
    var sort = req.query.sort
  } else {
    var sort = "dateasc"
  }

  if (req.query.page) {
    var page = req.query.page
  } else {
    var page = 0
  }

  if (req.query.limit) {
    var limit = req.query.limit
  } else {
    var limit = 10
  }

  console.log("sort: " + sort)
  
  Recurso.listRecursosUser(decoded.username, groups, sort,page,limit,level)
    .then(recursos => {
      console.log("recursos: " + recursos)
      res.jsonp(recursos)
    })

    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção da user de recursos" })
    })
});


/* GET recurso */
router.get('/api/recursos/:id', async function (req, res, next) {
  console.log("GET /api/recursos/" + req.params.id)
  var decoded = jwt.verify(req.query.token, "EngWeb2023")
  var level = decoded.level
  var groups = await Group.getGroupsUser(decoded.username)
  
  Recurso.getRecurso(req.params.id, decoded.username, groups, level)
    .then(response => {
      res.jsonp(response)
    })  
    .catch(e => {
      console.log("Erro na obtenção do recurso" )
    })
});


router.get('/api/search/groups/:pattern', function (req, res, next) {
  
  Group.searchGroup(req.params.pattern)
    .then(recursos => {
      console.log(recursos)
      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção dos grupos" })
    })
});


/* GET group */
router.get('/api/groups/:id', function (req, res, next) {
  console.log("GET /api/groups/" + req.params.id)

  Group.getGroup(req.params.id)
    .then(recursos => {

      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção do grupo" })
    })

});


// POST: de um recurso
router.post('/api/recursos', function (req, res) {
  console.log("POST /api/recursos")
  // Create a new file record in the database

  var token = req.query.token

  var available = {
    groups: req.body.groups,
    users: req.body.usernames
  };

  var recurso = {
    title: req.body.title,
    description: req.body.description,
    visibility: req.body.visibility,
    size: req.body.size,
    type: req.body.type,
    name: req.body.name,
    path: req.body.path,
    creator: req.body.creator,
    created: date,
    available_for: available,
    category: req.body.category
  }

  Recurso.addRecurso(recurso)
    .then(response => {

      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };

      //adding to submissions 
      axios.get('http://localhost:8002/users/' + response.creator + '/addSub/' + response._id + '?token=' + token)
        .then(response => {

          res.jsonp(responseWithToken);
        })
        .catch(e => {
          console.log("Erro ao atualizar submissions");
        })

    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na inserção do recurso" })
    })

})

// POST: de um grupo
router.post('/api/groups', function (req, res) {
  console.log("POST /api/groups")
  // Create a new file record in the database

  var token = req.query.token

  var group = {
    name: req.body.name,
    owner: req.body.owner,
    participants: req.body.usernames
  }

  Group.addGroup(group)
    .then(response => {
      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };

      // Create array of promises and add group to each participant
      let promises = group.participants.map(participant =>
        axios.get('http://localhost:8002/users/' + participant + '/addGroup/' + response._id + '?token=' + token)
      );

      // Add the creator to the array of promises
      promises.push(axios.get('http://localhost:8002/users/' + group.owner + '/addGroup/' + response._id + '?token=' + token));

      // Wait for all promises to resolve
      return Promise.all(promises).then(() => responseWithToken);
    })
    .then(responseWithToken => {
      res.jsonp(responseWithToken);
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na criação do grupo" })
    })

  /* Group.addGroup(group)
    .then(response => {
      
      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };

      //adding to submissions 
      axios.get('http://localhost:8002/users/' + response.creator + '/addGroup/' + response._id + '?token=' + token)
      .then(response => {

        res.jsonp(responseWithToken);
      })
      .catch(e =>{
        console.log("Erro ao atualizar submissions");
      })
      
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na inserção do recurso"})
    })
 */
})

// PUT: de um recurso
router.put('/api/:idUser/recursos/:id', function (req, res) {
  console.log("PUT /api/" + req.params.idUser + "/recursos/" + req.params.id)
  Lista.updateRecurso(req.params.idUser, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na edição do recurso" })
    })
})

// DELETE de um recurso
router.delete('/api/recursos/:file/creator/:creator', function (req, res) {
  console.log("DELETE /api/recursos/" + req.params.file + "/creator/" + req.params.creator)
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  if(decoded.username === req.params.creator || decoded.level == 'admin') {
    Recurso.deleteRecurso(req.params.file)
    .then(dados => {
      console.log("remove file: " + dados)
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na remoção de um ficheiro" })
    })
  }
  else {
    res.jsonp("You don't have permission to delete this file.")
  }
  
})

// GET tipos de recursos
router.get('/api/tipos', function (req, res) {
  console.log("GET /api/tipos")
  Recurso.tipos()
    .then(r => {
      res.jsonp(r)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção das tipos" })
    })
});


// GET recurso de um certo tipo 
router.get('/api/recursos/tipos/:tipo', async function (req, res) {
  console.log("GET /api/recursos/tipos/" + req.params.tipo)
  
  //decode the token
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var level = decoded.level
  var groups = await Group.getGroupsUser(decoded.username)

  // check if there is a sort query
  if (req.query.sort) {
    var sort = req.query.sort
  } else {
    var sort = "dateasc"
  }
  console.log("sort: " + sort)

  Recurso.recsByTipo(decoded.username, groups, req.params.tipo, sort, level)
    .then(recursos => {
      console.log("recursos: " + recursos)
      res.jsonp(recursos)
    })

    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção da user de recursos" })
    })
});

/* GET recursos disponíveis a um grupo*/
router.get('/api/recursos/group/:idGroup', async function (req, res, next) {

  
  Recurso.listRecursosGroup(req.params.idGroup)
    .then(recursos => {
      console.log("recursos: " + recursos)
      res.jsonp(recursos)
    })

    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção dos recursos do grupo" })
    })
});

/* DELETE group */
router.delete('/api/groups/:id', async function (req, res, next) {
  console.log("DELETE /api/groups/" + req.params.id)
  var token = ""
  if(req.query && req.query.token) {
    token = req.query.token
    console.log(token)
  }
  try {

    // Remove the group from available resources
    const removeResult = await Recurso.removeGroupAvailable(req.params.id);
    console.log("APAGOU DOS RECURSOS", removeResult);

    // Remove the group from users
    const userResponse = await axios.put('http://localhost:8002/users/removeGroup/' + req.params.id + '?token=' + token);
    console.log("APAGOU DOS USERS", userResponse.data);

    // Delete the group
    const deleteResult = await Group.deleteGroup(req.params.id);
    console.log("APAGOU GRUPO", deleteResult);

    res.jsonp(userResponse.data);
} catch (error) {
    console.log("Erro ao remover grupo.");
     
}

});

/* DELETE user from a group */
router.delete('/api/groups/:id/user/:username', async function (req, res, next) {
  console.log("DELETE /api/groups/" + req.params.id + '/user/' + req.params.username)
  var token = ""
  if(req.query && req.query.token) {
    token = req.query.token
    console.log(token)
  }
  try {

    
    // Remove the group from user
    const userResponse = await axios.put('http://localhost:8002/users/removeGroup/' + req.params.id + '/user/' + req.params.username + '?token=' + token);
    console.log("APAGOU DOS USERS", userResponse.data);

    // Remove user from group
    const deleteResult = await Group.deleteUserFromGroup(req.params.id, req.params.username);
    console.log("APAGOU DO GRUPO", deleteResult);

    res.jsonp(userResponse.data);
} catch (error) {
    console.log("Erro ao remover grupo.");
     
}

});

/* Adicionar users a grupos */
router.put('/api/groups/:id/user/:username', async function (req, res, next) {
  console.log("PUT /api/groups/" + req.params.id + '/user/' + req.params.username)
  var token = ""
  if(req.query && req.query.token) {
    token = req.query.token
    console.log(token)
  }
  try {
    
    
    const userResponse = await axios.get('http://localhost:8002/users/' + req.params.username + '/addGroup/' + req.params.id + '?token=' + token);
    console.log("ADICIONOU AO USER", userResponse.data);

    
    const deleteResult = await Group.addUserToGroup(req.params.id, req.params.username);
    console.log("ADICIONOU AO GRUPO", deleteResult);

    res.jsonp(userResponse.data);
} catch (error) {
    console.log("Erro ao adicionar ao grupo.");
     
}

});

/* GET categorias */
router.get('/api/categorias', async function (req, res, next) {
  console.log("GET /api/categorias/")
  
  Categoria.getCategorias()
    .then(response => {
      console.log(response)
      res.jsonp(response)
    })
    .catch(e => {
      console.log("Erro na obtenção das categorias.")
    })
});


// GET recurso de um certo categoria 
router.get('/api/recursos/categorias/:categ', async function (req, res) {
  console.log("GET /api/recursos/categorias/:categ" + req.params.tipo)
  
  //decode the token
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var level = decoded.level
  var groups = await Group.getGroupsUser(decoded.username)

  // check if there is a sort query
  if (req.query.sort) {
    var sort = req.query.sort
  } else {
    var sort = "dateasc"
  }
  console.log("sort: " + sort)

  Recurso.recsByCateg(decoded.username, groups, req.params.categ, sort, level)
    .then(recursos => {
      console.log("recursos: " + recursos)
      res.jsonp(recursos)
    })

    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção da user de recursos" })
    })
});

router.post('/api/categorias', function (req, res) {
  console.log("POST /api/categorias")
  // Create a new file record in the database

  var token = req.query.token

  var categoria = {
    name: req.body.name,
  }

  Categoria.addCategoria(categoria)
    .then(response => {

      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };
      res.jsonp(responseWithToken);
      

    })
    .catch(erro => {
      console.log("Erro na inserção da categoria")
    })

})


router.post('/api/recursos/:file/addComment', async function (req, res) {
  console.log("POST /api/recursos/"+req.params.file +"/addComment")
  
  var token = req.query.token

  var comment = {
    comment: req.body.comment,
    user: req.body.user,
    created: date
  }
  var groups = await Group.getGroupsUser(req.body.user)
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var level = decoded.level

  

  Recurso.getRecurso(req.params.file, req.body.user, groups,level)
    .then(response => {
      console.log("peguei recurso")
      if(response != null){
        console.log("dentro")
        Recurso.addComment(req.params.file, comment)
        .then(resp => {
          console.log("add")
          console.log(resp)
          // Create a new response object with token included
          const responseWithToken = {
            ...resp.toObject(),
            token: token
          };
          res.jsonp(responseWithToken);
          
    
        })
        .catch(erro => {
          console.log("Erro na inserção do comentário: " + erro)
        })
      }
      else {
        // Create a new response object with token included
        const responseWithToken = {
          token: token
        };
        
        res.jsonp(responseWithToken);
        
      }
    })  
    .catch(e => {
      console.log("Erro na obtenção do recursooo: " + e )
    })
  
  

}) 


router.delete('/api/recursos/:id/removeComment/:comment', function (req, res, next) {
  console.log("DELETE /api/recursos/" + req.params.id + '/removeComment/' + req.params.comment)
  var token = ""
  if(req.query && req.query.token) {
    token = req.query.token
    console.log(token)
  }
  
  Recurso.removeComment(req.params.id, req.params.comment)
    .then(response => {

      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };
      res.jsonp(responseWithToken);
      

    })
    .catch(erro => {
      console.log("Erro na remoção do comentário")
    })

});

router.put('/api/recursos/:id/editComment', function (req, res, next) {
  console.log("PUT /api/recursos/" + req.params.id + '/editComment')
  var token = ""
  if(req.query && req.query.token) {
    token = req.query.token
    console.log(token)
  }

  var comment = {
    _id: req.body._id,
    comment: req.body.comment,
    created: date
  }
  
  Recurso.updateComment(req.params.id, comment)
    .then(response => {

      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };
      res.jsonp(responseWithToken);
      

    })
    .catch(erro => {
      console.log("Erro na atualização do comentário")
    })

});
module.exports = router;

