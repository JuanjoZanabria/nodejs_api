function validateUser(requestBody) {
  return requestBody.hasOwnProperty("fullName") &&
    requestBody.hasOwnProperty("email") &&
    requestBody.hasOwnProperty("profilePicture") ?
    !isAnyKeyEmpty(requestBody) :
    false;
}

function isAnyKeyEmpty(requestBody) {
  let isEmpty = true;
  console.log(requestBody);
  var keys = Object.keys(requestBody);
  for (var key = 0; key < keys.length; key++) {
    isEmpty = requestBody[key] == "" ? true : false;
  }
  return isEmpty;
}

module.exports.validateUser = validateUser;
