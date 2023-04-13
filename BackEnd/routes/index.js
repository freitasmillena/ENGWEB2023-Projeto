var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso');
var jsonfile = require('jsonfile') // lê o ficheiro e converte automaticamente para mem
var fs = require('fs') // para verificar se o ficheiro existe, manipular o ficheiro

var multer = require('multer')
var upload = multer({dest: 'uploads/'})


/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 19)
  jsonfile.readFile(__dirname + '/../data/dbFiles.json', (err, registo) => {
    if(err) {
      console.log('err', {error: err})
    }
    else {
      res.render('fileManager', {files: registo, d: data})
    }
  })
});

// dentro do roteador tenho o pipeline horizontal, sendo que posso ter uma lista de funcs e depois chega até ao callback
// no app.js tenho o pipeline vertical, sendo que ele vai seguir as chamadas de funções por ordem
router.post('/files', upload.single('myFile'), (req, res, next) => {
  console.log('cdir: ' + __dirname)
  let oldPath = __dirname + '/../' + req.file.path
  console.log('oldPath: ' + oldPath)
  let newPath = __dirname + '/../public/filestore/' + req.file.originalname
  fs.rename(oldPath, newPath, (err) => {
    if(err) {
      console.log('err', {error: err})
    }})

  var data = new Date().toISOString().substring(0, 19)
  var files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json')

  files.push({
    date: data,
    name: req.file.originalname, 
    size: req.file.size,
    mimetype: req.file.mimetype,
    desc: req.body.desc
  })
  jsonfile.writeFileSync(__dirname + '/../data/dbFiles.json', files)
  res.redirect('/') 
})

router.get('/download/:fname', (req, res, next) => {
  res.download(__dirname + '/../public/filestore/' + req.params.fname)


})



/* GET pagina inicial */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET recursos */
router.get('/api/recursos', function(req, res, next) {
  Recurso.list()
    .then(recursos => {
      res.jsonp(recursos)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de recursos"})
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

/* GET users */
router.get('/api/users', function(req, res, next) {
  Recurso.getUsers()
    .then(users => {
      res.jsonp(users)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de users"})
    })
});

/* GET produtos de um certo user */
router.get('/api/users/:id/produtos', function(req, res, next) {
  Recurso.getRecursosOfUser(req.params.id)
    .then(produtos => {
      res.jsonp(produtos)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de recursos do user"})
    })
});
module.exports = router;
