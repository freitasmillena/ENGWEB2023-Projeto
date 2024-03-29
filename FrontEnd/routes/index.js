var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads' });
var fs = require('fs');
var jwt = require("jsonwebtoken")
var data = new Date().toISOString().substring(0, 16);
var axios = require('axios')
var env = require('../config/env.js')
var path = require('path')
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/about', function (req, res, next) {
  var token = ""
  var decoded
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log("TOKEN")
    try {
      decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    res.render('aboutPage', { username: decoded.username, level: decoded.level });

  }
  else {
    res.render('aboutPage');
  }
});

router.get('/logout', function (req, res, next) {
  console.log("LOGOUT")
  res.clearCookie('token');
  res.redirect('/')
});

router.get('/forgotPassword', function (req, res, next) {
  res.render('forgotPass');
});

router.post('/forgotPassword', function (req, res) {
  console.log(req.body.email)
  axios.post('http://localhost:8002/users/forgotPass', {
    email: req.body.email,
  })
    .then(function (response) {
      // Redirect to reset password page
      res.render('forgotPass', { message: 'If an account exists for ' + req.body.email + ', an email has been sent with further instructions.' });
    })
    .catch(function (err) {
      // Handle error - maybe the user entered a non-existent email
      console.error(err)
      res.render('error', { message: 'An error occurred. Please try again.' });
    });
})

router.get('/reset/:token', function (req, res) {
  // The reset token is stored in a cookie, so we don't need to pass it in the URL
  res.render('resetPass', { token: req.params.token });
});

router.post('/reset', function (req, res) {

  axios.post('http://localhost:8002/users/reset/' + req.body.token, {
    password: req.body.password,
  }, {
    // Send the reset token as a cookie in the request
    withCredentials: true
  })
    .then(function (response) {
      // Redirect to login page after successful password reset
      res.redirect('/');
    })
    .catch(function (err) {
      // Handle error - maybe the token expired or was invalid
      console.error(err)
      res.render('error', { message: 'An error occurred. Please try again.' });
    });
});

router.get('/uploadForm', function (req, res, next) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    console.log(decoded.level);
    if (decoded.level === "producer" || decoded.level === "admin") {
      console.log(token)
      res.render('formFile', { username: decoded.username, level: decoded.level });
    }
    else {
      res.redirect('/recursos?denied=true')
    }
  }

  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.get('/formGroup', function (req, res, next) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    console.log(decoded.level);
    if (decoded.level === "producer" || decoded.level === "admin") {
      console.log(token)
      res.render('formGroup', { user: decoded.username, level: decoded.level });
    }
    else {
      res.redirect('/recursos?denied=true')
    }
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.post('/formGroup', function (req, res) {

  console.log(req.body)
  if (req.body.usernames) {
    const filteredUsernames = req.body.usernames.filter(item => item !== '');
    req.body.usernames = filteredUsernames
  }
  else {
    req.body.usernames = []
  }

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }
  axios.post('http://localhost:7777/api/groups?token=' + token, req.body)
    .then(response => {

      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro no registo do grupo!", username: decoded.username, level: decoded.level })
    })
})

router.post('/updateUser/:username', function (req, res) {

  console.log(req.body)

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  axios.put('http://localhost:8002/users/' + req.params.username + '?token=' + token, req.body)
    .then(response => {
      console.log(response)
      res.cookie('token', response.data.token)
      res.redirect('/profile/' + req.params.username)
    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro ao atualizar user!", username: decoded.username, level: decoded.level })
    })
})

router.post('/updatePassword/:username', function (req, res) {

  console.log(req.body)

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  axios.put('http://localhost:8002/users/' + req.params.username + '/password' + '?token=' + token, req.body)
    .then(response => {
      console.log(response.data)
      res.cookie('token', response.data.token)
      res.redirect('/profile/' + req.params.username + '?passwordUpdated=true')
    })
    .catch(e => {
      console.log(e.data)
      res.redirect('/profile/' + req.params.username + '?passwordUpdated=false')
    })
})


router.get('/profile/:username', function (req, res, next) {
  console.log('GET profile')
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    var message
    if (req.query.passwordUpdated === "true") message = "Password updated successfully"
    else if (req.query.passwordUpdated === "false") message = "Could not update password."
    else if (req.query.groupDeleted === "true") message = "Group deleted successfully."
    else if (req.query.categoryAdded === "true") message = "Category added successfully."

    axios.get('http://localhost:8002/users/' + req.params.username + "?token=" + token)
      .then(user => {
        //console.log("sub: " + user.data.dados.submissions)
        //console.log("fav: " + user.data.dados.favorite)
        //console.log("groups: " + user.data.dados.groups)
        var submissionsPromises = user.data.dados.submissions.map(submission =>
          axios.get(env.apiAccessPoint + "/recursos/" + submission + "?token=" + token)
            .then(response => response.data)
        );

        var favoritesPromises = user.data.dados.favorites.map(favorite =>
          axios.get(env.apiAccessPoint + "/recursos/" + favorite + "?token=" + token)
            .then(response => response.data)
        );

        var groupsPromises = user.data.dados.groups.map(group =>
          axios.get(env.apiAccessPoint + "/groups/" + group + "?token=" + token)
            .then(response => response.data)
            .catch(err => console.log("Erro ao obter grupos"))
        );



        return Promise.all([...submissionsPromises, ...favoritesPromises, ...groupsPromises])
          .then(results => {
            var submissions = results.slice(0, user.data.dados.submissions.length);
            var favorites = results.slice(user.data.dados.submissions.length, user.data.dados.submissions.length + user.data.dados.favorites.length);
            var groups = results.slice(user.data.dados.submissions.length + user.data.dados.favorites.length);

            if (decoded.username === req.params.username) {
              if (decoded.level === 'admin') {
                axios.get(env.apiAccessPoint + "/categorias/?token=" + token)
                  .then(categorias => {


                    res.render('profilePage', { categorias: categorias.data, user: user.data.dados, submissions: submissions, favorites: favorites, groups: groups, message: message, username: decoded.username, level: decoded.level });
                  })
                  .catch(err => console.log("Erro ao obter categorias"))
              }
              else {
                res.render('profilePage', { user: user.data.dados, submissions: submissions, favorites: favorites, groups: groups, message: message, username: decoded.username, level: decoded.level });

              }

            }
            else {
              res.render('userPage', { user: user.data.dados, submissions: submissions, username: decoded.username, level: decoded.level });
            }
          });
      })
      .catch(err => {
        console.log("Erro ao buscar user.")
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }


});


router.post('/login', function (req, res) {
  axios.post('http://localhost:8002/users/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e => {
      res.render('index', { error: e, errorMessage: "Credenciais inválidas" });
    })
})

router.post('/register', function (req, res) {
  console.log(req.body)
  axios.post('http://localhost:8002/users/register', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro no registo!" })
    })
})

router.post('/uploadForm', upload.single('myFile'), function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decodedToken = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  req.body.name = req.file.originalname
  if (req.body.visibility === 'public') {
    req.body.groups = [0]
    req.body.usernames = decodedToken.username
  }
  else {
    const filteredUsernames = req.body.usernames.filter(item => item !== '');
    const filteredGroups = req.body.groups.filter(item => item !== '');
    filteredUsernames.push(decodedToken.username)
    req.body.usernames = filteredUsernames
    req.body.groups = filteredGroups
  }

  console.log(req.body)
  //Salvar em fileStorage
  console.log('cdir: ' + __dirname);
  let oldPath = __dirname + '/../' + req.file.path;
  console.log('oldPath: ' + oldPath);
  let newPath = __dirname + '/../public/fileStorage/' + req.file.originalname;
  console.log('newPath: ' + newPath);
  req.body.path = newPath
  fs.rename(oldPath, newPath, error => {
    if (error) throw error;
  });



  req.body.creator = decodedToken.username
  axios.post('http://localhost:7777/api/recursos?token=' + token, req.body)
    .then(response => {

      res.cookie('token', response.data.token)
      res.redirect('/recursos')
    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro no registo!", username: decodedToken.username, level: decodedToken.level })
    })
})

router.get('/recursos/tipos/:tipo', function (req, res) {
  console.log(req.params.tipo)
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if (req.query.sort) {
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


          var g_full = null
          axios.get(env.apiAccessPoint + "/user_groups?token=" + token)
            .then(response => {
              g_full = response.data



              var news = null
              axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
                .then(response => {
                  news = response.data

                  axios.get(env.apiAccessPoint + "/recursos/tipos/" + req.params.tipo + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                    .then(response => {

                      files = response.data
                      res.render('files', { groups: g_full, tipos: tipos, cat: categorias, files: files, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                    })
                    .catch(err => {
                      console.error(err)
                      res.render('error', { error: err, username: decoded.username, level: decoded.level })
                    })

                })
                .catch(err => {
                  console.error(err)
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              console.error(err)
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      console.error(err)
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});



router.get('/recursos/categorias/:categ', function (req, res) {
  console.log(req.params.categ)
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if (req.query.sort) {
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

          var g_full = null
          axios.get(env.apiAccessPoint + "/user_groups?token=" + token)
            .then(response => {
              g_full = response.data

              var news = null
              axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
                .then(response => {
                  news = response.data

                  axios.get(env.apiAccessPoint + "/recursos/categorias/" + req.params.categ + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                    .then(response => {
                      files = response.data
                      res.render('files', { groups: g_full, tipos: tipos, cat: categorias, files: files, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                    })
                    .catch(err => {
                      console.error(err)
                      res.render('error', { error: err, username: decoded.username, level: decoded.level })
                    })
                })
                .catch(err => {
                  console.error(err)
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              console.error(err)
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      console.error(err)
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});



router.get('/recursos/grupos/:g', function (req, res) {
  console.log(req.params.g)
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if (req.query.sort) {
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

          var g_full = null
          axios.get(env.apiAccessPoint + "/user_groups?token=" + token)
            .then(response => {
              g_full = response.data

              var news = null
              axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
                .then(response => {
                  news = response.data

                  axios.get(env.apiAccessPoint + "/recursos/grupos/" + req.params.g + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                    .then(response => {
                      files = response.data
                      res.render('files', { groups: g_full, tipos: tipos, cat: categorias, files: files, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                    })
                    .catch(err => {
                      console.error(err)
                      res.render('error', { error: err, username: decoded.username, level: decoded.level })
                    })
                })
                .catch(err => {
                  console.error(err)
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              console.error(err)
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      console.error(err)
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});

router.get('/recursos', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    var message
    if (req.query.denied) message = "Permission denied."

    const getFileExtension = (mimeType) => {
      const parts = mimeType.split('.');
      if (parts.length > 1) {
        return parts[parts.length - 1];
      }
      return mimeType.split('/')[1];
    };

    // check if is there a sort option in the url ?sort=...
    var sort = ""
    if (req.query.sort) {
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

                    files = response.data
                    var g_full = null
                    axios.get(env.apiAccessPoint + "/user_groups?token=" + token)
                      .then(response => {
                        g_full = response.data
                        res.render('files', { errorMessage: message, groups: g_full, tipos: tipos, cat: categorias, files: files, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                      })
                      .catch(err => {
                        console.error(err)
                        res.render('error', { error: err, username: decoded.username, level: decoded.level })
                      })
                  })
                  .catch(err => {
                    console.log("inside: " + err)
                    console.error(err)
                    res.render('error', { error: err, username: decoded.username, level: decoded.level })
                  })

              })
              .catch(err => {
                console.log("outside: " + err)
                console.error(err)
                res.render('error', { error: err, username: decoded.username, level: decoded.level })
              })

          })
          .catch(err => {

            console.error(err)
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })


      })
      .catch(err => {

        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }

});

router.get('/recursos/:id', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    axios.get(env.apiAccessPoint + "/recursos/" + req.params.id + "?token=" + token)
      .then(response => {
        if (response.data != null) {
          res.render('filePage', { file: response.data, d: data, username: decoded.username, level: decoded.level });
        }
        else {
          res.redirect('/recursos?denied=true')
        }

      })
      .catch(err => {
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.get('/recursos/cond/:categ', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token
  console.log(token)
  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  const getFileExtension = (mimeType) => {
    const parts = mimeType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return mimeType.split('/')[1];
  };

  // check if is there a sort option in the url ?sort=...
  var sort = ""
  if (req.query.sort) {
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

          var g_full = null
          axios.get(env.apiAccessPoint + "/user_groups?token=" + token)
            .then(response => {
              g_full = response.data

              var news = null
              axios.get(env.apiAccessPoint + "/recursos?sort=datedesc&token=" + token + "&page=0&limit=5")
                .then(response => {
                  news = response.data

                  axios.get(env.apiAccessPoint + "/recursos/cond/" + req.params.categ + "?sort=" + sort + "&token=" + token + "&page=0&limit=10")
                    .then(response => {
                      files = response.data
                      res.render('files', { groups: g_full, tipos: tipos, cat: categorias, files: files, d: data, user: decoded.username, getFileExtension: getFileExtension, username: decoded.username, level: decoded.level, news: news });
                    })
                    .catch(err => {
                      console.error(err)
                      res.render('error', { error: err, username: decoded.username, level: decoded.level })
                    })
                })
                .catch(err => {
                  console.error(err)
                  res.render('error', { error: err, username: decoded.username, level: decoded.level })
                })

            })
            .catch(err => {
              console.error(err)
              res.render('error', { error: err, username: decoded.username, level: decoded.level })
            })

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })

    })
    .catch(err => {
      console.error(err)
      res.render('error', { error: err, username: decoded.username, level: decoded.level })
    })

});


router.get('/groups/:id', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    axios.get(env.apiAccessPoint + "/groups/" + req.params.id + "?token=" + token)
      .then(group => {
        console.log(group.data.participants)

        if (group.data.participants.includes(decoded.username) || group.data.owner == decoded.username) {
          axios.get(env.apiAccessPoint + '/recursos/group/' + req.params.id + "?token=" + token)
            .then(recursos => {
              res.render('groupPage', { rec: recursos.data, group: group.data, username: decoded.username, level: decoded.level })
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
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.get('/deleteGroup/:id', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    console.log("group: " + req.params.id)
    axios.delete(env.apiAccessPoint + "/groups/" + req.params.id + "?token=" + token)
      .then(response => {
        console.log("APAGOU")
        console.log(response.data)
        res.json({ redirect: '/profile/' + decoded.username + '?groupDeleted=true' })

      })
      .catch(err => {
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.get('/group/:group/deleteUser/:username', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    console.log("group: " + req.params.group)
    axios.delete(env.apiAccessPoint + "/groups/" + req.params.group + '/user/' + req.params.username + "?token=" + token)
      .then(response => {
        console.log("APAGOU")
        console.log(response.data)
        res.json({ redirect: '/groups/' + req.params.group })
      })
      .catch(err => {
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.get('/group/:group/addUsers', async function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    console.log("group: " + req.params.group)
    console.log("users: " + req.query.selectedResults)
    const selectedResults = req.query.selectedResults

    try {
      for (const user of selectedResults) {
        axios.put(env.apiAccessPoint + "/groups/" + req.params.group + '/user/' + user + "?token=" + token)
          .then(response => {
            console.log("ADICIONOU")
            console.log(response.data)
            res.json({ redirect: '/groups/' + req.params.group })
          })
          .catch(err => {
            console.error(err)
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })
      }


    } catch (error) {
      console.error(error);

    }
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }

});

router.post('/addCategory', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token
  try {
    var decodedToken = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }
  console.log(req.body)

  axios.post('http://localhost:7777/api/categorias?token=' + token, req.body)
    .then(response => {

      res.cookie('token', response.data.token)
      res.redirect('/profile/' + decodedToken.username + '?categoryAdded=true')
    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro no registo!", username: decodedToken.username, level: decodedToken.level })
    })
})


router.get('/addfavorites/:file/user/:username', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decodedToken = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    axios.put('http://localhost:8002/users/' + req.params.username + '/addFavorites/' + req.params.file + '?token=' + token)
      .then(response => {
        axios.put(env.apiAccessPoint + '/recursos/' + req.params.file + '/addFavorites/' + "?token=" + token)
          .then(resp => {
            res.send('Added to favorites.')
          })
          .catch(err => {
            console.error(err)
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })


      })
      .catch(e => {
        console.error(err)
        res.render('error', { error: e, message: "Error adding to favorites!", username: decodedToken.username, level: decodedToken.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }

})

router.get('/removefavorites/:file/user/:username', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decodedToken = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    axios.put('http://localhost:8002/users/' + req.params.username + '/removeFavorites/' + req.params.file + '?token=' + token)
      .then(response => {
        axios.put(env.apiAccessPoint + '/recursos/' + req.params.file + '/removeFavorites/' + "?token=" + token)
          .then(resp => {
            res.send('Removed from favorites.')
          })
          .catch(err => {
            console.error(err)
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })

      })
      .catch(e => {
        console.error(e)
        res.render('error', { error: e, message: "Error removing from favorites!", username: decodedToken.username, level: decodedToken.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }

})

router.get('/favorites/:username', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    try {
      var decodedToken = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    axios.get('http://localhost:8002/users/' + req.params.username + '/favorites?token=' + token)
      .then(response => {

        res.json(response.data);

      })
      .catch(e => {
        console.error(e)
        res.render('error', { error: e, message: "Error retrieving favorites!", username: decodedToken.username, level: decodedToken.level })
      })
  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }

})

router.delete('/recursos/:id/creator/:creator', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    console.log(req.params.id)
    console.log(req.params.creator)

    axios.delete(env.apiAccessPoint + "/recursos/" + req.params.id + '/creator/' + req.params.creator + "?token=" + token)
      .then(response => {
        console.log("APAGOU RECURSO")
        console.log(response.data)

        axios.delete('http://localhost:8002/users/' + req.params.creator + '/removeFile/' + req.params.id + "?token=" + token)
          .then(resp => {
            console.log("APAGOU RECURSO DOS USERS")
            console.log(resp.data)
            res.json({ redirect: '/recursos?fileDeleted=true' })
          })
          .catch(err => {
            console.error(err)
            res.render('error', { error: err, username: decoded.username, level: decoded.level })
          })
      })
      .catch(err => {
        console.error(err)
        res.render('error', { error: err, username: decoded.username, level: decoded.level })
      })

  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.post('/recurso/:file/addComment', function (req, res) {

  console.log(req.body)

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  axios.post('http://localhost:7777/api/recursos/' + req.params.file + '/addComment?token=' + token, req.body)
    .then(response => {
      console.log(response.data)
      if (response.data.comments) {
        res.cookie('token', response.data.token)
        res.redirect('/recursos/' + req.params.file)
      }
      else {
        res.cookie('token', response.data.token)
        res.redirect('/recursos?denied=true')
      }

    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro no registo do comentário!", username: decoded.username, level: decoded.level })
    })
})

router.delete('/recursos/:id/removeComment/:comment/user/:user', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }

    if (req.params.user == decoded.username || decoded.level == 'admin') {
      axios.delete(env.apiAccessPoint + "/recursos/" + req.params.id + '/removeComment/' + req.params.comment + "?token=" + token)
        .then(response => {

          res.json({ redirect: '/recursos/' + req.params.id })

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })
    }

    else {
      res.redirect('/recursos?denied=true')
    }

  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.post('/recurso/:file/updateComment', function (req, res) {


  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  axios.put('http://localhost:7777/api/recursos/' + req.params.file + '/editComment?token=' + token, req.body)
    .then(response => {

      if (response.data.comments) {
        res.cookie('token', response.data.token)
        res.redirect('/recursos/' + req.params.file)
      }
      else {
        res.cookie('token', response.data.token)
        res.redirect('/recursos?denied=true')
      }

    })
    .catch(e => {
      console.error(e)
      res.render('error', { error: e, message: "Erro na atualização do comentário!", username: decoded.username, level: decoded.level })
    })
})

router.get('/download/:fileName', function (req, res) {
  console.log('GET /download/' + req.params.fileName)
  console.log(__dirname)
  console.log(req.params.fileName)

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }

  var fileName = req.params.fileName.trim()
  const filePath = path.join(__dirname, '/../public/fileStorage/', fileName);
  console.log("filePath: " + filePath)
  res.download(filePath)
  res.on('error', function (err) {
    console.error('Error during file download:', err);
  });
});


router.get('/fileContents/text.html', function (req, res) {
  console.log('GET/fileContents/text')

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }


  var fileName = req.query.file
  const filePath = path.join(__dirname, '/../public/fileStorage/', fileName);
  console.log("filePath: " + filePath)

  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      // Handle the error appropriately
      console.error(err);
      res.sendStatus(500);
    } else {

      res.render('textViewer', { fileContent: fileContent });
    }
  });
});

router.get('/fileContents/pdf.html', function (req, res) {
  console.log('GET/fileContents/pdf')

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }


  var fileName = req.query.file; // Get the file name from the query parameter

  const filePath = path.join(__dirname, '/../public/fileStorage/', fileName);
  console.log("filePath: " + filePath)

  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      // Handle the error appropriately
      console.error(err);
      res.sendStatus(500);
    } else {
      res.render('pdfViewer', { fileContent: fileContent });
    }
  });
});

router.get('/fileContents/ppt.html', async function (req, res) {
  console.log('GET/fileContents/ppt')

  var token = ""
  if (req.cookies && req.cookies.token)
    token = req.cookies.token

  try {
    var decoded = jwt.verify(token, "EngWeb2023");
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      // Here redirect to your login page
      return res.redirect('/');
    }
  }


  var fileName = req.query.file; // Get the file name from the query parameter

  const filePath = path.join(__dirname, '/../public/fileStorage/', fileName);
  var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
  // Configure API key authorization: Apikey
  var Apikey = defaultClient.authentications['Apikey'];
  Apikey.apiKey = '97c71407-e18d-47a9-be5f-3efbc5854026';
  var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
  var inputFile = Buffer.from(fs.readFileSync(filePath).buffer); // File | Input file to perform the operation on.
  var callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.render('pdfViewer', { fileContent: data });
    }
  };
  apiInstance.convertDocumentPptxToPdf(inputFile, callback);



});

//update 
router.get('/updateFile/:creator/:id', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    if (decoded.username === req.params.creator) {
      axios.get(env.apiAccessPoint + "/recursos/" + req.params.id + "?token=" + token)
        .then(response => {
          if (response.data != null) {
            res.render('updateFile', { file: response.data, d: data, username: decoded.username, level: decoded.level });
          }
          else {
            res.redirect('/recursos?denied=true')
          }

        })
        .catch(err => {
          console.error(err)
          res.render('error', { error: err, username: decoded.username, level: decoded.level })
        })
    }
    else {
      res.redirect('/recursos?denied=true')
    }

  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

router.post('/updateFile/:creator/:id', function (req, res) {
  var token = ""
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
    console.log(token)
    try {
      var decoded = jwt.verify(token, "EngWeb2023");
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Here redirect to your login page
        return res.redirect('/');
      }
    }
    if (decoded.username === req.params.creator) {
      console.log(req.body)
      if (req.body.visibility === 'public') {
        req.body.groups = [0]

      }
      else {

        if (req.body.groups) {
          const filteredGroups = req.body.groups.filter(item => item !== '');
          req.body.groups = filteredGroups
        }
        if (req.body.usernames) {
          const filteredUsernames = req.body.usernames.filter(item => item !== '');
          req.body.usernames = filteredUsernames
        }





      }

      axios.put('http://localhost:7777/api/updateFile/' + req.params.id + '?token=' + token, req.body)
        .then(response => {


          res.cookie('token', response.data.token)
          res.redirect('/recursos/' + req.params.id)



        })
        .catch(e => {
          console.error(e)
          res.render('error', { error: e, message: "Erro na atualização do recurso!", username: decoded.username, level: decoded.level })
        })
    }


  }
  else {
    res.render('index', { errorMessage: "You need to log in to access this page." });
  }
});

module.exports = router;

