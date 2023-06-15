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
    res.render('index', {error: e, errorMessage: "Permissão negada."});
  }
});

router.post('/login', function(req, res){
  axios.post('http://localhost:8002/users/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/uploadForm')
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
  
  req.body.name = req.file.originalname
  
  const filteredUsernames =  req.body.usernames.filter(item => item !== '');
  const filteredGroups =  req.body.groups.filter(item => item !== '');
  
  req.body.usernames = filteredUsernames
  req.body.groups = filteredGroups

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

  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  
  var decodedToken = jwt.verify(token, "EngWeb2023");

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


router.get('/recursos', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token

  axios.get(env.apiAccessPoint+"/recursos?token=" + token)
    .then(response => {
      res.render('files', { files: response.data, d: data });
    })
    .catch(err => {
      res.render('error', {error: err})
    })
});


module.exports = router;
