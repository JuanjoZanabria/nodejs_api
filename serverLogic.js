  //Public Methods
  function getUserId(fullName, email, profilePicture) {
    let userId = checkUserByEmail(email);

    if (userId < 0) {
      return addUser(fullName, email, profilePicture);
    } else {
      return userId;
    }
  }

  // Private Methods

  function checkUserByEmail(email){
    return -1;
  }

  function addUser(fullName, email, profilePicture){
    let idUsuario = 1;
    return idUsuario;
  }
  
module.exports.getUserId = getUserId;
