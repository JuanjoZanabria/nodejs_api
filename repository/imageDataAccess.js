const mongoose = require('mongoose');
const mongodbUri = 'mongodb://usuarioPruebas1:usuarioPruebas1@ds261660.mlab.com:61660/spotit';
const Image = require('../schemas/Image.js');

function openConnection() {
  mongoose.connect(mongodbUri);
}

function closeConnection() {
  mongoose.connection.close();
}

function saveImage(imageBase64, idUser, imgTransformed, callback) {
  let keyword = imgTransformed.queries.request[0].searchTerms.split(" ");
  var newImage = new Image({
    _id: new mongoose.Types.ObjectId(),
    idUser: idUser,
    originalImage: imageBase64,
    content: imgTransformed,
    favorite: false,
    keyword: keyword[0],
    description: imgTransformed.queries.request[0].searchTerms
  });
  openConnection();
  newImage.save(function(err, imgAdded) {
    closeConnection();
    callback(imgAdded._id);
  });
}

function getRecentSearches(idUser, callback) {
  openConnection();
  Image.find({
    'idUser': idUser
  }, function(err, recentSearches) {
    closeConnection();
    if (recentSearches) {
      callback(recentSearches);
    } else {
      callback(recentSearches);
    }
  });
}

function getFavorites(idUser, callback) {
  openConnection();
  Image.find({
    'idUser': idUser,
    'favorite': true
  }, function(err, favorites) {
    closeConnection();
    if (favorites) {
      callback(favorites);
    } else {
      callback(favorites);
    }
  });
}

function checkImageById(idImage, callback) {
  openConnection();
  Image.findById(idImage, function(err, imageExists) {
    closeConnection();
    if (imageExists) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function getImageById(idImage, callback) {
  openConnection();
  Image.findById(idImage, function(err, mongoImage) {
    closeConnection();
    if (mongoImage) {
      callback(mongoImage);
    }
  });
}

function setImageFavoriteValue(idImage, callback) {
  openConnection();
  Image.findById(idImage, function(err, image) {
    image.favorite = !image.favorite;
    image.save(function(err, image) {
      closeConnection();
      callback(image.favorite);
    })
  });
}

function getImagePopularSearches(callback) {
  openConnection();
  var popularImages = {};
  Image.find({}, function(err, images) {
    images.forEach(function(image) {
      popularImages[image._id + "/" + image.keyword] = image.content;
    });
    closeConnection();
    callback(popularImages);
  });
}

module.exports.getImageById = getImageById;
module.exports.getImagePopularSearches = getImagePopularSearches;
module.exports.setImageFavoriteValue = setImageFavoriteValue;
module.exports.checkImageById = checkImageById;
module.exports.getFavorites = getFavorites;
module.exports.saveImage = saveImage;
module.exports.getRecentSearches = getRecentSearches;
