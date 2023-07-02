var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

router.post('/forgotPass', function(req, res) {
  const resetPasswordToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  console.log(req.body.email)
  // Assume User is your User model
  User.getUserEmail(req.body.email)
    .then(user => {
      if (!user) {
        // No user found with that email
        console.log("No user found with that email")
        return res.json({ message: 'An email has been sent to ' + req.body.email + ' with further instructions.' });
      }

      User.updateUserReset(req.body.email, resetPasswordToken, resetPasswordExpires)
        .then(response => {
          
            // Email the user
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey("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")
            const msg = {
              to: user.email, // Change to your recipient
              from: 'crocshare@gmail.com', // Change to your verified sender
              subject: 'Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:7778/reset/' + resetPasswordToken + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            }
            sgMail
              .send(msg)
              .then(() => {
                console.log('Email sent')
                res.cookie('resetToken', resetPasswordToken, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.json({ message: 'An email has been sent to ' + req.body.email + ' with further instructions.' });
              
              })
              .catch((error) => {
                console.error(error)
              })
        })
        .catch(err => {
          console.error(err)
        })
      
      
      
  })
    .catch(err => {
      console.error(err)
    })

  
})



router.post('/reset/:token', function(req, res) {
  const token = req.params.token;

  User.getUserReset(token)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Password reset token is invalid or has expired.' });
      }

      // Set the new password using Passport's setPassword method
      user.setPassword(req.body.password, function(err) {
        if (err) {
          console.error(erro)
          return res.status(500).json({ message: 'Error resetting password.' });
        }

        // Update the user's reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save()
          .then(() => {
            res.status(200).json({ message: 'Password has been reset.' });
          })
          .catch(err => {
            console.error(erro)
            res.status(500).json({ message: 'Error resetting password.' });
          });
      });
    })
    .catch(err => {
      console.error(erro)
      res.status(500).json({ message: 'Error finding user.' });
    });
});


router.put('/:id', auth.verificaAcesso, function(req, res) {
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      console.log("token: " + req.query.token)
      dados.token = req.query.token
      console.log(dados)
      res.jsonp(dados)
    })
    .catch(erro => {
      console.error(erro)
    })
})

router.put('/:id/desativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      console.error(erro)
    })
})

router.put('/:id/ativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      console.error(erro)
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
            console.error(err)
          return res.status(401).send({ message: 'Old password is incorrect' });
      }
      
        // Set the new password
        await user.setPassword(newPassword, async (err) => {
          if (err) {
            console.error(err)
            return res.status(500).send({ message: 'An error occurred while setting the new password' });
          }
        
        // Save the user document
        await user.save();
        res.send({ message: 'Password updated successfully', token: req.query.token });
      });
    });
    })
    .catch(err => {
      console.error(err)
    })
})

router.delete('/:id', auth.verificaAcesso, function(req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      console.error(erro)
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