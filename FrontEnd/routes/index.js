var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/recursos', function(req, res, next) {
  res.render('formFile');
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


module.exports = router;
