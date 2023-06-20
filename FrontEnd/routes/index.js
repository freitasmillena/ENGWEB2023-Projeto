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

router.get('/logout', function(req, res, next) {
  console.log("LOGOUT")
  res.clearCookie('token');
  res.redirect('/')
});

router.get('/uploadForm', function(req, res, next) {
  var token = ""
  if(req.cookies && req.cookies.token){
    token = req.cookies.token
    var decoded = jwt.verify(token, "EngWeb2023");
    console.log(decoded.level);
    if(decoded.level === "producer" || decoded.level === "admin"){
      console.log(token)
      res.render('formFile', {username: decoded.username, level: decoded.level});
    }
    else {
      res.redirect('/recursos?denied=true')
    }
  }
  
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
});

router.get('/formGroup', function(req, res, next) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    var decoded = jwt.verify(token, "EngWeb2023");
    console.log(decoded.level);
    if(decoded.level === "producer" || decoded.level === "admin"){
      console.log(token)
      res.render('formGroup', {user: decoded.username, level: decoded.level});
    }
    else {
      res.redirect('/recursos?denied=true')
    }
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
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
  
  var decoded = jwt.verify(token, 'EngWeb2023')
  axios.post('http://localhost:7777/api/groups?token=' + token, req.body)
    .then(response => {
      
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro no registo do grupo!", username: decoded.username, level: decoded.level})
    }) 
}) 

router.post('/updateUser/:username', function(req, res){
  
  console.log(req.body)
    
   var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  
  var decoded = jwt.verify(token, 'EngWeb2023')
    
  axios.put('http://localhost:8002/users/' + req.params.username + '?token=' + token, req.body)
    .then(response => {
      console.log(response)
      res.cookie('token', response.data.token)
      res.redirect('/profile/' + req.params.username)
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro ao atualizar user!", username: decoded.username, level: decoded.level})
    }) 
}) 

router.post('/updatePassword/:username', function(req, res){
  
  console.log(req.body)
    
   var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  
  
    
  axios.put('http://localhost:8002/users/' + req.params.username + '/password' +'?token=' + token, req.body)
    .then(response => {
      console.log(response.data)
      res.cookie('token', response.data.token)
      res.redirect('/profile/' + req.params.username + '?passwordUpdated=true')
    })
    .catch(e =>{
      console.log(e.data)
      res.redirect('/profile/' + req.params.username + '?passwordUpdated=false')
    }) 
}) 


router.get('/profile/:username', function(req, res, next) {
  console.log('GET profile')
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    var decoded = jwt.verify(token, "EngWeb2023");
    var message
    if(req.query.passwordUpdated=== "true") message = "Password updated successfully"
    else if(req.query.passwordUpdated=== "false") message = "Could not update password."
    else if(req.query.groupDeleted === "true") message = "Group deleted successfully."
    else if(req.query.categoryAdded === "true") message = "Category added successfully."
    
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
                if(decoded.level === 'admin') {
                  axios.get(env.apiAccessPoint+"/categorias/?token=" + token)
                  .then(categorias => {
                    console.log("CAT:")
                    console.log(categorias.data);
                      
                    res.render('profilePage', {categorias: categorias.data, user: user.data.dados, submissions: submissions, favorites: favorites, groups: groups, message: message, username: decoded.username, level: decoded.level});
                  }) 
                  .catch(err => console.log("Erro ao obter categorias"))
                }
                else {
                  res.render('profilePage', {user: user.data.dados, submissions: submissions, favorites: favorites, groups: groups, message: message, username: decoded.username, level: decoded.level});
                 
                }
                
                }
              else {
                res.render('userPage', {user: user.data.dados, submissions: submissions, username: decoded.username, level: decoded.level});
              } 
            });
      })
      .catch(err => {
        console.log("Erro ao buscar user.")
        res.render('error', {error: err, username: decoded.username, level: decoded.level})
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
  
  
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
      res.render('error', {error: e, message: "Erro no registo!", username: decodedToken.username, level: decodedToken.level})
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

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if(req.query.sort) {
    sort = req.query.sort
    console.log(sort)
  }

  var tipos = null
  axios.get(env.apiAccessPoint+"/tipos?token=" + token)
    .then(response => {
      tipos = response.data


      var categorias = null
      axios.get(env.apiAccessPoint + "/categorias?token=" + token)
        .then(response => {
          categorias = response.data



          var news = null
          axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
            .then(response => {
              news = response.data

              axios.get(env.apiAccessPoint + "/recursos/tipos/" + req.params.tipo + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                .then(response => {
                  res.render('files', { tipos: tipos, cat: categorias, files: response.data, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                })
                .catch(err => {
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});



router.get('/recursos/categorias/:categ', function(req, res) {
  console.log(req.params.categ)
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

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if(req.query.sort) {
    sort = req.query.sort
    console.log(sort)
  }

  var tipos = null
  axios.get(env.apiAccessPoint+"/tipos?token=" + token)
    .then(response => {
      tipos = response.data


      var categorias = null
      axios.get(env.apiAccessPoint + "/categorias?token=" + token)
        .then(response => {
          categorias = response.data



          var news = null
          axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
            .then(response => {
              news = response.data

              axios.get(env.apiAccessPoint + "/recursos/categorias/" + req.params.categ + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                .then(response => {
                  res.render('files', { tipos: tipos, cat: categorias, files: response.data, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                })
                .catch(err => {
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});

router.get('/recursos', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023");
    var message
    if(req.query.denied) message = "Permission denied."

    const getFileExtension = (mimeType) => {
      const parts = mimeType.split('.');
      if (parts.length > 1) {
        return parts[parts.length - 1];
      }
      return mimeType.split('/')[1];
    };

    // check if is there a sort option in the url ?sort=...
    var sort = ""
    if(req.query.sort) {
      sort = req.query.sort
      console.log(sort)
    }

    var tipos = null
    axios.get(env.apiAccessPoint + "/tipos?token=" + token)
      .then(response => {
        tipos = response.data

        var categorias = null
        axios.get(env.apiAccessPoint + "/categorias?token=" + token)
          .then(response => {
            categorias = response.data


            var news = null
            axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
              .then(response => {
                news = response.data

                console.log(news)
                axios.get(env.apiAccessPoint + "/recursos?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                  .then(response => {
                    res.render('files', { tipos: tipos, cat: categorias, files: response.data, news: news, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, errorMessage: message });
                  })
                  .catch(err => {
                    res.render('error', { error: err, username: decoded.username, level: decoded.level })
                  })

              })
              .catch(err => {
                res.render('error', { error: err, username: decoded.username, level: decoded.level })
              })

          })
          .catch(err => {
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })


      })
      .catch(err => {
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
  
});

router.get('/recursos/:id', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023")
    axios.get(env.apiAccessPoint+"/recursos/" + req.params.id + "?token=" + token)
      .then(response => {
        res.render('filePage', { file: response.data, d: data, username: decoded.username, level: decoded.level });
      })
      .catch(err => {
        res.render('error', {error: err, username: decoded.username, level: decoded.level})
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
});

router.get('/groups/:id', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023")
    
    axios.get(env.apiAccessPoint+"/groups/" + req.params.id +"?token=" + token)
      .then(group => {
       console.log(group.data.participants)
       
       if(group.data.participants.includes(decoded.username) || group.data.owner == decoded.username) {
          axios.get(env.apiAccessPoint+'/recursos/group/'+ req.params.id +"?token=" + token)
            .then(recursos => {
              res.render('groupPage', {rec: recursos.data, group: group.data, username: decoded.username, level: decoded.level})
            })
            .catch(e => {
              console.log("Erro ao buscar recursos do grupo.")
            })
       }
       else {
        res.redirect('/recursos?denied=true')
       }
       
       
        //res.render('filePage', { file: response.data, d: data, username: decoded.username, level: decoded.level });
      })
      .catch(err => {
        res.render('error', {error: err, username: decoded.username, level: decoded.level})
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
});

router.get('/deleteGroup/:id', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023")
    
    console.log("group: " + req.params.id)
    axios.delete(env.apiAccessPoint+"/groups/" + req.params.id +"?token=" + token)
      .then(response => {
       console.log("APAGOU")
       console.log(response.data)
       res.json({redirect: '/profile/' + decoded.username + '?groupDeleted=true'})
       
      })
      .catch(err => {
        res.render('error', {error: err, username: decoded.username, level: decoded.level})
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
});

router.get('/group/:group/deleteUser/:username', function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023")
    
    console.log("group: " + req.params.group)
    axios.delete(env.apiAccessPoint+"/groups/" + req.params.group + '/user/' + req.params.username +"?token=" + token)
      .then(response => {
       console.log("APAGOU")
       console.log(response.data)
       res.json({redirect: '/groups/' + req.params.group})
      })
      .catch(err => {
        res.render('error', {error: err, username: decoded.username, level: decoded.level})
      })
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }
});

router.get('/group/:group/addUsers', async function(req, res) {
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    var decoded = jwt.verify(token, "EngWeb2023")
    
    console.log("group: " + req.params.group)
    console.log("users: " + req.query.selectedResults)
    const selectedResults = req.query.selectedResults

    try {
      for (const user of selectedResults) {
        axios.put(env.apiAccessPoint+"/groups/" + req.params.group + '/user/' + user +"?token=" + token)
        .then(response => {
         console.log("ADICIONOU")
         console.log(response.data)
         res.json({redirect: '/groups/' + req.params.group})
        })
        .catch(err => {
          res.render('error', {error: err, username: decoded.username, level: decoded.level})
        })
      }
      
      
    } catch (error) {
      console.error(error);
      
    }
  }
  else {
    res.render('index', {errorMessage: "You need to log in to access this page."});
  }

});

router.post('/addCategory', function(req, res){
  var token = ""
  if(req.cookies && req.cookies.token)
    token = req.cookies.token
  var decodedToken = jwt.verify(token, 'EngWeb2023')
  console.log(req.body)
     
  axios.post('http://localhost:7777/api/categorias?token=' + token, req.body)
    .then(response => {
      
      res.cookie('token', response.data.token)
      res.redirect('/profile/' + decodedToken.username +'?categoryAdded=true')
    })
    .catch(e =>{
      res.render('error', {error: e, message: "Erro no registo!", username: decodedToken.username, level: decodedToken.level})
    }) 
})


router.get('/addfavorites/:file/user/:username', function(req, res){
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    var decodedToken = jwt.verify(token, 'EngWeb2023')

    axios.put('http://localhost:8002/users/' + req.params.username + '/addFavorites/' + req.params.file + '?token=' + token)
      .then(response => {
        res.send('Added to favorites.')
        
      })
      .catch(e =>{
        res.render('error', {error: e, message: "Error adding to favorites!", username: decodedToken.username, level: decodedToken.level})
      }) 
  }
    else {
      res.render('index', {errorMessage: "You need to log in to access this page."});
    }
  
})

router.get('/removefavorites/:file/user/:username', function(req, res){
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    var decodedToken = jwt.verify(token, 'EngWeb2023')

    axios.put('http://localhost:8002/users/' + req.params.username + '/removeFavorites/' + req.params.file + '?token=' + token)
      .then(response => {
        res.send('Removed from favorites.')
        
      })
      .catch(e =>{
        res.render('error', {error: e, message: "Error removing from favorites!", username: decodedToken.username, level: decodedToken.level})
      }) 
  }
    else {
      res.render('index', {errorMessage: "You need to log in to access this page."});
    }
  
})

router.get('/favorites/:username', function(req, res){
  var token = ""
  if(req.cookies && req.cookies.token) {
    token = req.cookies.token
    var decodedToken = jwt.verify(token, 'EngWeb2023')

    axios.get('http://localhost:8002/users/' + req.params.username + '/favorites?token=' + token)
      .then(response => {
        
        res.json(response.data);
        
      })
      .catch(e =>{
        res.render('error', {error: e, message: "Error retrieving favorites!", username: decodedToken.username, level: decodedToken.level})
      }) 
  }
    else {
      res.render('index', {errorMessage: "You need to log in to access this page."});
    }
  
})
module.exports = router;
