  const mongoose = require('mongoose');
  const mongodbUri = 'mongodb://usuarioPruebas1:usuarioPruebas1@ds261660.mlab.com:61660/spotit';
  const User = require('../schemas/User.js');

  function openConnection() {
    mongoose.connect(mongodbUri);
  }

  function closeConnection() {
    mongoose.connection.close();
  }

  function isUserSignedUpAlready(user, callback) {
    openConnection();
    User.findOne({
      'email': user.email
    }, function(err, userExists) {
      closeConnection();
      if (userExists) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  function addUser(user, callback) {
    var newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: {
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        fullName: user.name.fullName
      },
      email: user.email,
      picture: user.picture
    });
    openConnection();
    newUser.save(function(err, userAdded) {
      closeConnection();
      callback(userAdded._id);
    });
  }

  function getUserId(user, callback) {
    openConnection();
    User.findOne({
      'email': user.email
    }, function(err, userFound) {
      closeConnection();
      callback(userFound._id);
    });
  }

  function getUserById(userID, callback) {
    openConnection();
    User.findById(userID, function(err, userExists) {
      closeConnection();
      if (userExists) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  module.exports.getUserById = getUserById;
  module.exports.getUserId = getUserId;
  module.exports.addUser = addUser;
  module.exports.isUserSignedUpAlready = isUserSignedUpAlready;
