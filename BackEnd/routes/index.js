var express = require('express');
var router = express.Router();
var Group = require('../controllers/group');
var Recurso = require('../controllers/recurso');
var date = new Date().toISOString().substring(0,16);

/* GET recursos */
router.get('/api/recursos', function(req, res, next) {
  console.log("GET /api/recursos")
  Recurso.listRecursosUser(req.user)
    .then(recursos => {
      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da user de recursos"})
    })
});

router.get('/api/search/groups/:pattern', function(req, res, next) {
  console.log("ENTREI")
  Group.searchGroup(req.params.pattern)
    .then(recursos => {
      console.log(recursos)
      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção dos grupos"})
    })
});

/* GET recurso */
router.get('/api/recursos/:id', function(req, res, next) {
  console.log("GET /api/recursos/" + req.params.id)
  Recurso.getRecurso(req.params.id)
    .then(recurso => {
      res.jsonp(recurso)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do recurso"})
    })
});


// POST: de um recurso
router.post('/api/recursos', function(req, res) {
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
    available_for: available
  }
 
  Recurso.addRecurso(recurso)
    .then(response => {
      
      // Create a new response object with token included
      const responseWithToken = {
        ...response.toObject(),
        token: token
      };
      
      res.jsonp(responseWithToken);
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na inserção do recurso"})
    })
})

// PUT: de um recurso
router.put('/api/:idUser/recursos/:id', function(req, res) {
  console.log("PUT /api/" + req.params.idUser + "/recursos/" + req.params.id)
  Lista.updateRecurso(req.params.idUser, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na edição do recurso"})
    })
})

// DELETE de um recurso
router.delete('/api/:idUser/recursos/:id', function(req, res) {
  console.log("DELETE /api/" + req.params.idUser + "/recursos/" + req.params.id)
  Lista.deleteRecurso(req.params.idUser, req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na inserção de um produto"})
    })
})

// GET tipos de recursos
router.get('/api/tipos', function(req, res) {
  console.log("GET /api/tipos")
  user.tipos()
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção das tipos"})
    })
});


// GET recurso de um certo tipo 
router.get('/api/recursos/tipos/:id', function(req, res) {
  console.log("GET /api/recursos/tipos/" + req.params.id)
  user.recsByTipo(req.params.id)
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção dos tipos"})
    })
});


module.exports = router;