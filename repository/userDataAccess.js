  const mongoose = require('mongoose');
  const mongodbUri = 'mongodb://usuarioPruebas1:usuarioPruebas1@ds261660.mlab.com:61660/spotit';
  const User = require('../schemas/User.js');

  function openConnection() {
    mongoose.connect(mongodbUri);
  }

  function closeConnection() {
    mongoose.connection.close();
  }

  function isUserSignedUpAlready(user) {
    User.findOne({
      'email': user.email
    }, function(err, result) {
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
  }

  function addUser(user) {
    var n = new User();
    n.name.firstName = user.name.firstName;
    n.name.lastName = user.name.lastName;
    n.name.fullName = user.name.fullName;
    n.email = user.email;
    n.picture = user.picture;
    console.log("adduser");
    n.save(function(err, room) {
      console.log(room.id);
      return room.id;
    });
    /*User.create({
      name: {
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        fullName: user.name.fullName
      },
      email: user.email,
      picture: user.picture
    }, function(err, room) {
      return room._id;
    });*/
  }

  function getUserId(user) {
  //  var usuario =
    var usuario = User.findOne({
      'email': user.email
    }, function(err, obj) {
      if(obj){
        console.log("Objeto usuario: " + obj._id);
        return obj._id;
      }
       });
  //  if (usuario)
  //  {
  //    console.log("Esquema usuario: " + JSON.stringify(usuario.schema));
  //    var id = usuario.schema;
  //    console.log("Id de usuario: " + JSON.stringify(id.paths._id.path));
  console.log("Usuario: " + JSON.stringify(usuario));
      return usuario;
  //  }

  }


  module.exports.getUserId = getUserId;
  module.exports.addUser = addUser;
  module.exports.isUserSignedUpAlready = isUserSignedUpAlready;
  module.exports.closeConnection = closeConnection;
  module.exports.openConnection = openConnection;
