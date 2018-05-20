/*
Atributos
*/
var userTemplate = {
  fullName:"", email:"", profilePicture:""
};

//Public Methods
function getUser(user) {
  userTemplate = user;
  let userId = isUserSignedUpAlready() ? getUserId() : addUser();
  return formatUser(userId);
}

// Private Methods
function isUserSignedUpAlready() {
  return false;
}

function addUser() {
  return 1;
}

function getUserId() {
  return 1;
}

function formatUser(userId) {
  let formattedUserIdResponse = {
    UserId: userId
  }
  return formattedUserIdResponse;
}

module.exports.getUser = getUser;
