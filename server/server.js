/*
Requires
*/
const https = require('https');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const bodyParser = require('body-parser');
const mergeJSON = require('merge-json');
const googleClient = require('../api/googleClient');
const serviceLogic = require('./serverLogic');
const serviceValidate = require('./serverValidation');
const templates = require('../templates/messagesTemplates.json');

/*
Atributos
*/
const server = express();

passport.use(
  new GoogleStrategy({
    //options for google strat
    callbackURL: '/auth/google/redirect',
    clientID: '720993327430-emfmqq94uksa9s6r45h69n2muj7n3np3.apps.googleusercontent.com',
    clientSecret: 'MuZC4ntbHXVGQfuU0jvPI2Er'
  }, (accessToken, refreshToken, profile, done) => {
    //passport callback function
    console.log('passportCallback function fired');
    console.log('---Nombre: ' + profile.displayName);
    console.log('---ID Google: ' + profile.id);
    //console.log('---Correo: ' + profile.emails[0].value);
    console.log(profile);
    done(null, false);
  })
)

/*
Lanzar el servidor en el puerto 3003
*/
server.listen(3003, function() {
  console.log("Server is up and listening on 3003...");
})

server.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
server.use(bodyParser.json({
  limit: '50mb'
}));

/*
desc: Asignar token al usuario
queryParams: N/A
req: credenciales (correo, nombre completo, foto)
res: id del usuario
*/
server.post("/auth", function(req, res) {
  console.log(templates.messages.uri.auth.called);
  if (serviceValidate.validateUser(req.body)) {
    serviceLogic.requestUser(req.body, function(userId) {
      res.send(userId);
      console.log(templates.messages.uri.auth.task1);
    });
  } else {
    let response = templates.messages.uri.auth.incorrectRequestBody;
    res.status(response.status).send(response.text);
  }
});
/*
desc: Identifica fotografia y devuelve toda la informacion
queryParams: N/A
req: token, imageUri
res: resultado, idImagen en BBDD
*/
server.post("/user/:idUser/image", function(req, res) {
  console.log(templates.messages.uri.image.called);
  let idUser = req.params.idUser;
  if (req.body.imageBase64 && serviceValidate.validateImageBase64(req.body.imageBase64)) {
    let imageBase64 = req.body.imageBase64;
    let formattedRequest = googleClient.setRequest(imageBase64);
    serviceValidate.userExists(idUser, function(exists) {
      if (exists) {
        let promiseImageAnnotated = googleClient.getImageAnnotated(formattedRequest);
        promiseImageAnnotated.then(imageAnnotated => {
            serviceLogic.setImageAnnotated(imageAnnotated);
            let promiseSearchEngine = serviceLogic.getSearchEngineLabels("");
            promiseSearchEngine.then(searchEngineLabels => {
              var searchEngineLabelsParsed = JSON.parse(JSON.stringify(searchEngineLabels));
              var imageWithMergedLabels = mergeJSON.merge(searchEngineLabelsParsed, imageAnnotated[0]);
              serviceLogic.setFinalImageLabeled(imageWithMergedLabels);
              imgTransformed = serviceLogic.transformImageLabeled();
              serviceLogic.setUser(idUser);
              serviceLogic.saveImage(imageBase64, function(idImageSaved) {
                console.log("Task 2: Getting Image from GoogleVision  --- Successful");
                res.status(200).json({
                  "idImage": idImageSaved,
                  "image": imgTransformed
                });
              });
            }).catch(err => console.log(err.message));
          })
          .catch(err => console.log(err.message));
      } else {
        let response = templates.messages.uri.image.incorrectRequestBody;
        res.status(response.status).send(response.text);
      }
    });
  } else if (req.body.searchEngineQuotes) {
    let promiseSearchEngine = serviceLogic.getSearchEngineLabels(req.body.searchEngineQuotes);
    promiseSearchEngine.then(searchEngineLabels => {
      var searchEngineLabelsParsed = JSON.parse(JSON.stringify(searchEngineLabels));
      serviceLogic.setFinalImageLabeled(searchEngineLabelsParsed);
      imgTransformed = serviceLogic.transformImageLabeled();
      serviceLogic.setUser(idUser);
      serviceLogic.saveImage("", function(idImageSaved) {
        console.log("Task 2: Getting Image from GoogleVision  --- Successful");
        res.status(200).json({
          "idImage": idImageSaved,
          "image": imgTransformed
        });
      });
    }).catch(err => console.log(err.message));
  } else {
    let response = templates.messages.uri.image.incorrectRequestBody;
    res.status(response.status).send(response.text);
  }
})

/*
desc: Permite filtrar una imagen por idSolicitud
pathParams: idSolicitud
req: N/A
res: resultado
*/
server.get("/user/:idUser/image/:idImage", function(req, res) {
  let idImage = req.params.idImage;
  let filters = serviceLogic.getFilters(req);
  serviceLogic.getImage(idImage, function(mongoImage) {
    if (mongoImage) {
      console.log("Server filters " + JSON.stringify(filters));
      let filteredImage = serviceLogic.applyFilters(mongoImage, filters);
      console.log("Responding to root route");
      console.log("Task 3: Create GoogleClient --- Successful");
      res.send(filteredImage);
    }
  });

})
/*
desc: Permite ver y filtrar las busquedas recientes por lotes
queryParams: token, filtros, lote
req: N/A
res: resultado
*/
server.get("/user/:idUser/recentSearches", function(req, res) {
  let idUser = req.params.idUser;
  serviceValidate.userExists(idUser, function(exists) {
    if (exists) {
      serviceLogic.setUser(idUser);
      serviceLogic.getRecentSearches(function(recentSearches) {
        console.log("Responding to root route");
        console.log("Task 4: Create GoogleClient --- Successful");
        res.send(recentSearches);
      })
    } else {
      let response = templates.messages.uri.image.incorrectRequestBody;
      res.status(response.status).send(response.text);
    }
  });
})
/*
desc: Permite ver y filtrar las busquedas populares por lotes
queryParams: filtros, lote
req: N/A
res: resultado
*/
server.get("/popularSearches", function(req, res) {
  serviceLogic.getPopularSearches(function(popularSearches) {
    console.log("Responding to root route");
    console.log("Task 5: Create GoogleClient --- Successful");
    res.send(popularSearches);
  });
})
/*
desc: Permite ver y filtrar los favoritos por lotes
queryParams: token, filtros, lote
req: N/A
res: resultado
*/
server.get("/user/:idUser/favoriteSearches", function(req, res) {
  let idUser = req.params.idUser;
  serviceValidate.userExists(idUser, function(exists) {
    if (exists) {
      serviceLogic.setUser(idUser);
      serviceLogic.getFavorites(function(favorites) {
        console.log("Responding to root route");
        console.log("Task 6: Create GoogleClient --- Successful");
        res.send(favorites);
      })
    } else {
      let response = templates.messages.uri.image.incorrectRequestBody;
      res.status(response.status).send(response.text);
    }
  });
})

/*
desc: Permite actualizar una imagen como favorita
queryParams: idUser, idImage
req: N/A
res: resultado
*/
server.put("/user/:idUser/image/:idImage", function(req, res) {
  let idUser = req.params.idUser;
  let idImage = req.params.idImage;
  serviceValidate.userExists(idUser, function(exists) {
    if (exists) {
      serviceLogic.setUser(idUser);
      serviceValidate.imageExists(idImage, function(exists) {
        if (exists) {
          serviceLogic.setFavorites(idImage, function(status) {
            console.log("Responding to root route");
            console.log("Task 6: Create GoogleClient --- Successful");
            res.status(200).send("Favorito: " + status);
          });
        } else {
          let response = templates.messages.uri.image.incorrectRequestBody;
          res.status(response.status).send(response.text);
        }
      });
    } else {
      let response = templates.messages.uri.image.incorrectRequestBody;
      res.status(response.status).send(response.text);
    }
  });
})
