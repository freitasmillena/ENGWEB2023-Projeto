var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: '../BackEnd/uploads'});
var fs = require('fs');
var jwt = require("jsonwebtoken")
var data = new Date().toISOString().substring(0,16);
var axios = require('axios')
var env = require('../config/env.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/uploadForm', function(req, res, next) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  var decoded = jwt.verify(token, "EngWeb2023");
  console.log(decoded.level);
  if(decoded.level === "producer" || decoded.level === "admin"){
    console.log(token)
    res.render('formFile');
  }
  else {
    res.render('index', {errorMessage: "Permissão negada."});
  }
});

router.get('/formGroup', function(req, res, next) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  var decoded = jwt.verify(token, "EngWeb2023");
  console.log(decoded.level);
  if(decoded.level === "producer" || decoded.level === "admin"){
    console.log(token)
    res.render('formGroup', {user: decoded.username});
  }
  else {
    res.render('index', {error: e, errorMessage: "Permissão negada."});
  }
});

router.post('/formGroup', function(req, res){
  
  console.log(req.body)
  if(req.body.usernames) {
    const filteredUsernames =  req.body.usernames.filter(item => item !== '');  
    req.body.usernames = filteredUsernames
  }
  else {
    req.body.usernames = []
  }
  
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  
    
  axios.post('http://localhost:7777/api/groups?token=' + token, req.body)
    .then(response => {
      
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro no registo do grupo!"})
    }) 
}) 

router.get('/profile/:username', function(req, res, next) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  var decoded = jwt.verify(token, "EngWeb2023");
  
  axios.get('http://localhost:8002/users/'+ req.params.username + "?token=" + token)
    .then(user => {
      //console.log("sub: " + user.data.dados.submissions)
      //console.log("fav: " + user.data.dados.favorite)
      //console.log("groups: " + user.data.dados.groups)
          var submissionsPromises = user.data.dados.submissions.map(submission => 
            axios.get(env.apiAccessPoint+"/recursos/" + submission +"?token=" + token)
            .then(response => response.data)
          );
          
          var favoritesPromises = user.data.dados.favorites.map(favorite => 
            axios.get(env.apiAccessPoint+"/recursos/" + favorite +"?token=" + token)
            .then(response => response.data)
          );
              
          var groupsPromises = user.data.dados.groups.map(group => 
            axios.get(env.apiAccessPoint+"/groups/" + group +"?token=" + token)
            .then(response => response.data)
            .catch(err => console.log("Erro ao obter grupos"))
          );
          
          return Promise.all([...submissionsPromises, ...favoritesPromises, ...groupsPromises])
          .then(results => {
            var submissions = results.slice(0, user.data.dados.submissions.length);
            var favorites = results.slice(user.data.dados.submissions.length, user.data.dados.submissions.length + user.data.dados.favorites.length);
            var groups = results.slice(user.data.dados.submissions.length + user.data.dados.favorites.length);
            console.log('submissions:', submissions);
            console.log('favorites:', favorites);
            console.log('groups:', groups);
            if(decoded.username === req.params.username){
              
              res.render('profilePage', {user: user.data.dados, submissions: submissions, favorites: favorites, groups: groups});
            }
            else {
              res.render('userPage', {user: user.data.dados, submissions: submissions});
            } 
          });
    })
    .catch(err => {
      console.log("Erro ao buscar user.")
      res.render('error', {error: err})
    })

  
});


router.post('/login', function(req, res){
  axios.post('http://localhost:8002/users/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e =>{
      res.render('index', {error: e, errorMessage: "Credenciais inválidas"});
    })
})

router.post('/register', function(req, res){
  console.log(req.body)
  axios.post('http://localhost:8002/users/register', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro no registo!"})
    })
})

router.post('/uploadForm', upload.single('myFile'),function(req, res){
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  
  var decodedToken = jwt.verify(token, "EngWeb2023");

  req.body.name = req.file.originalname
  if(req.body.visibility === 'public') {
    req.body.groups = [0]
    req.body.usernames = decodedToken.username
  }
  else {
  const filteredUsernames =  req.body.usernames.filter(item => item !== '');
  const filteredGroups =  req.body.groups.filter(item => item !== '');
  filteredUsernames.push(decodedToken.username)
  req.body.usernames = filteredUsernames
  req.body.groups = filteredGroups
  }

  console.log(req.body)
  //Salvar em fileStorage
  console.log('cdir: ' + __dirname);
  let oldPath = __dirname + '/../' + req.file.path;
  console.log('oldPath: ' + oldPath);
  let newPath = __dirname + '/../../BackEnd/fileStorage/' + req.file.originalname;
  console.log('newPath: ' + newPath);
  req.body.path = newPath
  fs.rename(oldPath, newPath, error => {
    if(error) throw error;
  });

  

  req.body.creator = decodedToken.username
  axios.post('http://localhost:7777/api/recursos?token=' + token, req.body)
    .then(response => {
      
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro no registo!"})
    }) 
}) 

router.get('/recursos/tipos/:tipo', function(req, res) {
  console.log(req.params.tipo)
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  var decoded = jwt.verify(token, "EngWeb2023");

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  axios.get(env.apiAccessPoint+"/recursos/tipos/" + req.params.tipo + "?token=" + token)
    .then(response => {
      res.render('files', { files: response.data, d: data, user: decoded.username, getFileExtension: getFileExtension});
    })
    .catch(err => {
      res.render('error', {error: err})
    })
});

router.get('/recursos', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  var decoded = jwt.verify(token, "EngWeb2023");

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  axios.get(env.apiAccessPoint+"/recursos?token=" + token)
    .then(response => {
      res.render('files', { files: response.data, d: data, user: decoded.username, getFileExtension: getFileExtension});
    })
    .catch(err => {
      res.render('error', {error: err})
    })
});

router.get('/recursos/:id', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  axios.get(env.apiAccessPoint+"/recursos/" + req.params.id + "?token=" + token)
    .then(response => {
      res.render('filePage', { file: response.data, d: data });
    })
    .catch(err => {
      res.render('error', {error: err})
    })
});

module.exports = router;
