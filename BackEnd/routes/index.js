var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso');

/* GET recursos */
router.get('/api/recursos', function(req, res, next) {
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
  user.tipos()
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção das tipos"})
    })
});


// GET recurso de um certo tipo 
router.get('/api/tipos/:id/recursos', function(req, res) {
  user.recsByTipo(req.params.id)
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção dos tipos"})
    })
});


module.exports = router;