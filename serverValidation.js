function validateUser(requestBody) {
  let keys = Object.keys(requestBody);
  return keys.length = 3 &&
    requestBody.hasOwnProperty("fullName") &&
    requestBody.hasOwnProperty("email") &&
    requestBody.hasOwnProperty("profilePicture") ?
    !isAnyKeyEmpty(requestBody) :
    false;
}

function isAnyKeyEmpty(requestBody) {
  let isEmpty = true;
  console.log(requestBody);
  for (var key = 0; key < 3; key++) {
    isEmpty = isStringEmpty(requestBody[key]) ? true : false;
  }
  return isEmpty;
}

function isStringEmpty(value){
  return value == "";
}

module.exports.validateUser = validateUser;
