var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/resource');

/* GET recursos */
router.get('/api/recursos', function(req, res, next) {
  console.log("GET /api/recursos")
  Recurso.listRecursos()
    .then(recursos => {
      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da user de recursos"})
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
  Lista.addRecurso(req.body)
    .then(recurso => {
      res.jsonp(recurso)
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