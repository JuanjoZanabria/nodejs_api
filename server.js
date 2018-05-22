/*
Requires
*/
const express = require('express');
const googleClient = require('./googleClient');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const bodyParser = require('body-parser');
const serviceLogic = require('./serverLogic');
const serviceValidate = require('./serverValidation');
const templates = require('./messagesTemplates.json');
const https = require('https');
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
  let response = serviceValidate.validateUser(req.body) ? serviceLogic.getUser(req.body) : templates.messages.uri.auth.incorrectRequestBody;
  console.log(templates.messages.uri.auth.called);
  //conexion a base de datos
  //consulta que inserte el usuario y devuelva en idUsuario el id:
  //insert(fullName, email, profilePicture) values (fullName,email,profilePicture)
  //addParameters () comprobar nulos
  //Ejecutar
  //idUsuario = resultado de la consulta.
  console.log(response);
  if (response.hasOwnProperty("status"))
    res.status(response.status).send(response.text);
  else
    res.send(response);
  console.log(templates.messages.uri.auth.task1);
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
  let promise = googleClient.getImageAnnotated(formattedRequest);
  promise.then(imageAnnotated => {
      let q = imageAnnotated[0].webDetection.webEntities[0].description;
      let imgTransformed = serviceLogic.transformImageAnnotated(imageAnnotated);
      res.send(imgTransformed);
      console.log(imageAnnotated[0].labelAnnotations[0].description)
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

  var apiKeySearchEngine = "key=AIzaSyANKZcPxLG3EPNCSdB8M-9jH9S_PljSoU4";
  var customSearchEngine = "cx=014899129568475050489:mzgfwcuvxte";
  var quotesSearchEngine = "q=t-shirt";
  var uriSearchEngine = "https://www.googleapis.com/customsearch/v1" +
  "?" + apiKeySearchEngine +
  "&" + customSearchEngine +
  "&" + quotesSearchEngine;
  https.get(uriSearchEngine, (res) => { 
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });
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
