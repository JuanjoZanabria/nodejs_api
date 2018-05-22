function validateUser(requestBody) {
  let labels = Object.keys(requestBody);
  return labels.length = 3 &&
    requestBody.hasOwnProperty("fullName") &&
    requestBody.hasOwnProperty("email") &&
    requestBody.hasOwnProperty("profilePicture") ?
    !isAnyLabelEmpty(requestBody) :
    false;
}

function isAnyLabelEmpty(requestBody) {
  let isEmpty = true;
  console.log(requestBody);
  for (var label = 0; label < 3; label++) {
    isEmpty = isStringEmpty(requestBody[label]) ? true : false;
  }
  return isEmpty;
}

function isStringEmpty(value){
  return value == "";
}

module.exports.validateUser = validateUser;
