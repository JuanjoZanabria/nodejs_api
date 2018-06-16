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
      request.name.hasOwnProperty("fullName") ?
      allLabelsHaveValue(request.name) : false;
  } else {
    return false;
  }
}

function allLabelsHaveValue(keys) {
  let isEmpty = true;
  for (var label = 0; label < keys.length; label++) {
    isEmpty = isStringEmpty(keys[label]) ? true : false;
  }
  return isEmpty;
}

function isStringEmpty(value) {
  return value == "";
}

module.exports.validateUser = validateUser;
