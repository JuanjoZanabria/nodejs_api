const userDataAccess = require('../repository/userDataAccess');
const imageDataAccess = require('../repository/imageDataAccess');
const requestLength = 3;
const nameLength = 3;
var request;
var labels;

function validateUser(requestBody) {
  request = requestBody;
  labels = Object.keys(request);
  return validateRequestLength() &&
    validateName() &&
    validatePicture() &&
    validateEmail() &&
    allLabelsHaveValue(request);
}

function validateRequestLength() {
  return labels.length == requestLength;
}

function validatePicture() {
  return request.hasOwnProperty("picture");
}

function validateEmail() {
  return request.hasOwnProperty("email");
}

function validateName() {
  let hasName = request.hasOwnProperty("name");
  if (hasName) {
    let nameLabels = Object.keys(request.name);
    return nameLabels.length == nameLength &&
      request.name.hasOwnProperty("firstName") &&
      request.name.hasOwnProperty("lastName") &&
      request.name.hasOwnProperty("fullName");
  } else {
    return false;
  }
}

function allLabelsHaveValue(keys) {
  keys.forEach(function(el) {
    Object.keys(el).forEach(function(property) {
      console.log(el[property]);
      if (el[property] == '') {
        return false;
      }
    });
    return true;
  });

  /*
      for (var label = 0; label < Object.keys(keys).length; label++) {
        let valuesDelParametroEntrada = Object.values(keys);
        console.log("iteracion: "+label);
        console.log("Values de Variab "+valuesDelParametroEntrada);
        if (Object.getOwnPropertyNames(valuesDelParametroEntrada)) {
          console.log("Keys de Variab[label] "+Object.keys(valuesDelParametroEntrada[label]));
          return allLabelsHaveValue(valuesDelParametroEntrada[label]);
        } else {
          console.log("Valores de keys "+Object.values(keys));
          variabe = Object.values(keys);
          haveValue = isStringEmpty(variabe[label]) ? false : true;
        }
      }
      return haveValue;*/
}

function isStringEmpty(value) {
  console.log(value);
  return value == "";
}

function userExists(userId, callback) {
  userDataAccess.getUserById(userId, function(userExists) {
    callback(userExists);
  });
}

function imageExists(idImage, callback) {
  imageDataAccess.checkImageById(idImage, function(imageExists) {
    callback(imageExists);
  });
}

module.exports.imageExists = imageExists;
module.exports.userExists = userExists;
module.exports.validateUser = validateUser;
