/*
Requires
*/
const express = require('express');
const googleClient = require('./googleClient');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const bodyParser = require('body-parser');
/*
Atributos
*/
const server = express();
const instanceGoogleClient = new googleClient();



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
  var idUsuario = Number.MIN_SAFE_INTEGER;
  var fullName = req.body.fullName;
  var email = req.body.email; //? req.Email : lanzarErrorCampoVacio("email");
  var profilePicture = req.body.profilePicture;
  console.log("Responding to req of auth");
  //conexion a base de datos
  //consulta que inserte el usuario y devuelva en idUsuario el id:
  //insert(fullName, email, profilePicture) values (fullName,email,profilePicture)
  //addParameters () comprobar nulos
  //Ejecutar
  //idUsuario = resultado de la consulta.
  idUsuario = 10;
  instanceGoogleClient.print("Task 1: Insert in BBDD the user --- Successful");
  console.log(req.body);
  var idUsuarioJSON = "{ IdUsuario: "+idUsuario+" }";
  res.send(idUsuarioJSON);
});
/*
desc: Identifica fotografia y devuelve toda la informacion
queryParams: N/A
req: token, imageUri
res: resultado
*/
server.post("/image", function(req, res) {
  console.log("Responding to root route");
  instanceGoogleClient.print("Task 2: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
/*
desc: Permite filtrar una imagen por idSolicitud
queryParams: idSolicitud
req: N/A
res: resultado
*/
server.get("/image", function(req, res) {
  console.log("Responding to root route");
  instanceGoogleClient.print("Task 3: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
/*
desc: Permite ver y filtrar las busquedas recientes por lotes
queryParams: token, filtros, lote
req: N/A
res: resultado
*/
server.get("/recentSearchs", function(req, res) {
  console.log("Responding to root route");
  instanceGoogleClient.print("Task 4: Create GoogleClient --- Successful");
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
  instanceGoogleClient.print("Task 5: Create GoogleClient --- Successful");
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
  instanceGoogleClient.print("Task 6: Create GoogleClient --- Successful");
  res.send("Respuesta");
})
