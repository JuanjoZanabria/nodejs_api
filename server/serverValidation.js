const userDataAccess = require('../repository/userDataAccess');
const imageDataAccess = require('../repository/imageDataAccess');
const requestLength = 3;
const nameLength = 3;
var request;
var labels;

function validateImageBase64(imageBase64) {
  let isEncodedBase64 = false;
  try {
    window.atob(imageBase64);
    isEncodedBase64 = true;
  } catch (err) {
    isEncodedBase64 = false;
  } finally {
    console.log(isEncodedBase64);
    return isEncodedBase64;
  }
}

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
  for(let key in keys){
    console.log(key + ' - ' + keys[key])
    if (key === 'name'){
        let userName = Object.values(key);
        userName.forEach(function(name){
          if (name == '') {
            return false;
          }
        });
    }else{
      if (keys[key] == '') {
        return false;
      }
    }
  }
  return true;
/*  keys.forEach(el => {
    Object.keys(el).forEach(property => {
      console.log(el[property]);
      if (el[property] == '') {
        return false;
      }
    });
    return true;
  });
*/
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

module.exports.validateImageBase64 = validateImageBase64;
module.exports.imageExists = imageExists;
module.exports.userExists = userExists;
module.exports.validateUser = validateUser;
