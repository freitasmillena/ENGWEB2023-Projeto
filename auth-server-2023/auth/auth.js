var jwt = require('jsonwebtoken')

module.exports.verificaAcesso = function (req, res, next){
  console.log("auth")
    var myToken = req.query.token || req.body.token
    if(myToken){
      jwt.verify(myToken, "EngWeb2023", function(e, payload){
        if(e){
          console.log("erro")
          res.status(401).jsonp({error: e})
        }
        else{
          next()
        }
      })
    }
    else{
      res.status(401).jsonp({error: "Token inexistente!"})
    }
  }

