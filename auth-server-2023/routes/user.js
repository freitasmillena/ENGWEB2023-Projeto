var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

router.get('/', auth.verificaAcesso, function(req, res){
  User.list()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/groups/:id', auth.verificaAcesso, function(req, res){
  
  User.getUserGroups(req.params.id)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/search/:pattern', auth.verificaAcesso, function(req, res){
  User.searchUser(req.params.pattern)
    .then(dados => {
      console.log(dados)
      res.status(200).jsonp({dados: dados})
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/:id/addSub/:sub', auth.verificaAcesso, function(req, res){
  
  User.updateSubmissions(req.params.id, req.params.sub)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/:id/addGroup/:group', auth.verificaAcesso, function(req, res){
  
  User.updateGroups(req.params.id, req.params.group)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})


router.get('/:id', auth.verificaAcesso, function(req, res){
  User.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/username/:username', function(req, res){
  User.getUsername(req.params.username)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/email/:email', function(req, res){
  User.getUserEmail(req.params.email)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/', auth.verificaAcesso, function(req, res){
  User.addUser(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/register', function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  console.log(req.body.level)
  userModel.register(new userModel({ username: req.body.username, name: req.body.name, 
                                      level: req.body.level, surname: req.body.surname, email: req.body.email, dataRegisto: d }), 
                req.body.password, 
                function(err, user) {
                  if (err) 
                    res.jsonp({error: err, message: "Register error: " + err})
                  else{
                    passport.authenticate("local")(req,res,function(){
                      jwt.sign({ username: req.user.username, level: req.user.level,
                        sub: 'aula de EngWeb2023'}, 
                        "EngWeb2023",
                        {expiresIn: 3600},
                        function(e, token) {
                          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                          else res.status(201).jsonp({token: token})
                        });
                    })
                  }     
  })
})
  
router.post('/login', passport.authenticate('local'), function(req, res){
  jwt.sign({ username: req.user.username, level: req.user.level, 
    sub: 'aula de EngWeb2023'}, 
    "EngWeb2023",
    {expiresIn: 3600},
    function(e, token) {
      if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
});
})

router.put('/:id', auth.verificaAcesso, function(req, res) {
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      console.log("token: " + req.query.token)
      dados.token = req.query.token
      console.log(dados)
      res.jsonp(dados)
    })
    .catch(erro => {
      console.log(erro)
    })
})

router.put('/:id/desativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/ativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/password', auth.verificaAcesso, async function(req, res) {

  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  await User.getUser(userId)
    .then(user => {
        // Verify the old password
        user.authenticate(oldPassword, async (err, result) => {
        if (err || !result) {
          console.log("passe errada")
          return res.status(401).send({ message: 'Old password is incorrect' });
      }
      
        // Set the new password
        await user.setPassword(newPassword, async (err) => {
          if (err) {
            console.log("só jesus sabe")
            return res.status(500).send({ message: 'An error occurred while setting the new password' });
          }
        
        // Save the user document
        await user.save();
        console.log("feito")
        res.send({ message: 'Password updated successfully', token: req.query.token });
      });
    });
    })
    .catch(err => {
      console.log("Erro ao obter user.")
    })
})

router.delete('/:id', auth.verificaAcesso, function(req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na remoção do utilizador"})
    })
})

router.put('/removeGroup/:group', auth.verificaAcesso, function(req, res){
  console.log("GRUPO: " + req.params.group)
  User.removeGroupUsers(req.params.group)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.put('/removeGroup/:group/user/:username', auth.verificaAcesso, function(req, res){
  console.log("GRUPO: " + req.params.group)
  console.log("USER: " + req.params.username)
  User.removeGroupUser(req.params.username, req.params.group)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.put('/:username/addFavorites/:file', auth.verificaAcesso, function(req, res){
  console.log("FILE: " + req.params.file)
  console.log("USER: " + req.params.username)
  User.addFavorite(req.params.username, req.params.file)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.put('/:username/removeFavorites/:file', auth.verificaAcesso, function(req, res){
  console.log("FILE: " + req.params.file)
  console.log("USER: " + req.params.username)
  User.removeFavorite(req.params.username, req.params.file)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/:username/favorites', auth.verificaAcesso, function(req, res){
  console.log("USER: " + req.params.username)
  User.getFavorites(req.params.username)
    .then(dados => {
      
      res.status(200).jsonp(dados)
    })
    .catch(e => res.status(500).jsonp({error: e}))
})


router.delete('/:username/removeFile/:file', auth.verificaAcesso , function (req, res, next) {
  console.log("DELETE /users/" + req.params.username + '/removeFile/' + req.params.file)
  
  User.removeSubmission(req.params.username, req.params.file)
    .then(dados => {
      console.log("remove sub: " + dados.data)
      User.removeFavoritesUsers(req.params.file)
        .then(resp => {
          console.log("remove fav: " + resp.data)
          res.status(200).jsonp(resp)
        })
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
  

});

module.exports = router;