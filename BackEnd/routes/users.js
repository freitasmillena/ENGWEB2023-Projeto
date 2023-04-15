var express = require('express');
var router = express.Router();
var User = require('../controllers/user');


/* GET users */
router.get('/api/users', function(req, res, next) {
  User.list()
    .then(users => {
      res.jsonp(users)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da user de users"})
    })
});

/* GET user */
router.get('/api/users/:id', function(req, res, next) {
  User.getUser(req.params.id)
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do user"})
    })
});

// POST: de um user
router.post('/api/users', function(req, res) {
  user.addUser(req.body)
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na inserção da user"})
    })
})


module.exports = router;
