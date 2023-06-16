var express = require('express');
const { decode } = require('jsonwebtoken');
var router = express.Router();
var Group = require('../controllers/group');
var Recurso = require('../controllers/recurso');
var date = new Date().toISOString().substring(0, 16);
var jwt = require('jsonwebtoken')
var axios = require('axios')

/* GET recursos */
router.get('/api/recursos', async function (req, res, next) {

  //decode the token
  var decoded = jwt.verify(req.query.token, "EngWeb2023");
  var groups = await Group.getGroupsUser(decoded.username)

  Recurso.listRecursosUser(decoded.username, groups)
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
  var groups = await Group.getGroupsUser(decoded.username)
  
  Recurso.getRecurso(req.params.id, decoded.username, groups)
    .then(response => {
      res.jsonp(response)
    })
    .catch(e => {
      res.render('error', { error: erro, message: "Erro na obtenção do recurso" })
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
    available_for: available
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
router.delete('/api/:idUser/recursos/:id', function (req, res) {
  console.log("DELETE /api/" + req.params.idUser + "/recursos/" + req.params.id)
  Lista.deleteRecurso(req.params.idUser, req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na inserção de um produto" })
    })
})

// GET tipos de recursos
router.get('/api/tipos', function (req, res) {
  console.log("GET /api/tipos")
  user.tipos()
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção das tipos" })
    })
});


// GET recurso de um certo tipo 
router.get('/api/recursos/tipos/:id', function (req, res) {
  console.log("GET /api/recursos/tipos/" + req.params.id)
  user.recsByTipo(req.params.id)
    .then(user => {
      res.jsonp(user)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na obtenção dos tipos" })
    })
});


module.exports = router;

