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
server.use(bodyParser.json()); // support json encoded bodies

/*
desc: Asignar token al usuario
queryParams: N/A
req: credenciales (correo, nombre completo, foto)
res: id del usuario
*/
server.post("/auth", function(req, res) {
  if (serviceValidate.validateUser(req.body)) {
    let response = serviceLogic.requestUser(req.body);
    console.log(response);
    res.send(response);
    console.log(templates.messages.uri.auth.task1);
  } else {
    let response = templates.messages.uri.auth.incorrectRequestBody;
    res.status(response.status).send(response.text);
  }
  console.log(templates.messages.uri.auth.called);
  //conexion a base de datos
  //consulta que inserte el usuario y devuelva en idUsuario el id:
  //insert(fullName, email, profilePicture) values (fullName,email,profilePicture)
  //addParameters () comprobar nulos
  //Ejecutar
  //idUsuario = resultado de la consulta.
});
/*
desc: Identifica fotografia y devuelve toda la informacion
queryParams: N/A
req: token, imageUri
res: resultado, idImagen en BBDD
*/
server.post("/image", function(req, res) {
  console.log(templates.messages.uri.image.called);
  let imagenUri = req.body.imageUri;
  console.log("Uri de la imagen: " + imagenUri);
  let formattedRequest = googleClient.setRequest(imagenUri);
  let promiseImageAnnotated = googleClient.getImageAnnotated(formattedRequest);
  promiseImageAnnotated.then(imageAnnotated => {
      serviceLogic.setImageAnnotated(imageAnnotated);
      let promiseSearchEngine = serviceLogic.getSearchEngineLabels();
      promiseSearchEngine.then(searchEngineLabels => {
        var searchEngineLabelsParsed = JSON.parse(JSON.stringify(searchEngineLabels));
        var imageWithMergedLabels = mergeJSON.merge(searchEngineLabelsParsed, imageAnnotated[0]);
        serviceLogic.setFinalImageLabeled(imageWithMergedLabels);
        imgTransformed = serviceLogic.transformImageLabeled();
        //guardar en BBDD
        res.send(imgTransformed);
      })
    })
    .catch(err => console.log(err.message));
  console.log("Task 2: Getting Image from GoogleVision  --- Successful");
})

/*
desc: Permite filtrar una imagen por idSolicitud
pathParams: idSolicitud
req: N/A
res: resultado
*/
server.get("/image/:idImage", function(req, res) {
  let filters = getFilters(req);
  let idImage = req.params.idImage;
  let originalImage = serviceLogic.getImageFromDB(idImage);
  let filteredImage = serviceLogic.applyFilters(originalImage, filters);
  console.log("Responding to root route");
  console.log(filters);
  console.log(idImage);
  console.log("Task 3: Create GoogleClient --- Successful");
  res.send(filteredImage);
})
/*
desc: Permite ver y filtrar las busquedas recientes por lotes
queryParams: token, filtros, lote
req: N/A
res: resultado
*/
server.get("/recentSearchs", function(req, res) {
  console.log("Responding to root route");
  console.log("Task 4: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
/*
desc: Permite ver y filtrar las busquedas populares por lotes
queryParams: filtros, lote
req: N/A
res: resultado
*/
server.get("/popularSearchs", function(req, res) {
  console.log("Responding to root route");
  console.log("Task 5: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
/*
desc: Permite ver y filtrar los favoritos por lotes
queryParams: token, filtros, lote
req: N/A
res: resultado
*/
server.get("/favoriteSearchs", function(req, res) {
  console.log("Responding to root route");
  console.log("Task 6: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
