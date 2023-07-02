var createError = require('http-errors');
var express = require('express');
var jwt = require('jsonwebtoken')
var logger = require('morgan');
const path = require('path');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/recursos';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.on('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
})

var indexRouter = require('./routes/index');

var app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(logger('dev'));


app.use(function(req, res, next){
 
  var myToken 
  if(req.query && req.query.token) {
    
    myToken = req.query.token}
  else if(req.body && req.body.token) {
    
    myToken = req.body.token}
  else {
    
    myToken = false}
  
  if(myToken){
    
      jwt.verify(myToken, "EngWeb2023", function(e, payload){
        if(e){
          console.error("Error on token")
          res.status(401).jsonp({error: e})
        }
        else{
          console.log("next")
          next()
        }
      })
    }
    else{
      console.error("erro token n existe")
      res.status(401).jsonp({error: "Token inexistente!"})
    }
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err})
});

module.exports = app;
