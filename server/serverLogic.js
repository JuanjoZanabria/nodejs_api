const labels = require('../templates/labelsTemplates.json');
const searchEngineClient = require('../api/searchEngineClient');
const userDataAccess = require('../repository/userDataAccess');
const imageDataAccess = require('../repository/imageDataAccess');
/*
Atributos
*/
var imageAnnotatedTemplate = {};
var finalImageLabelsTemplate = {};
var imgTransformed = {};
var maxNumberOfDescriptionsWanted = 5;
var userTemplate = {
  name: {
    firstName: "",
    lastName: "",
    fullName: ""
  },
  email: "",
  picture: ""
};
var idUser = "";

//Public Methods
function getPopularSearches(callback) {
  imageDataAccess.getImagePopularSearches(function(images) {
    let popularImages = getImagesWithPopularDescriptions(images);
    callback(popularImages);
  });
}

function setFavorites(idImage, callback) {
  imageDataAccess.setImageFavoriteValue(idImage, function(status) {
    callback(status);
  });
}

function getRecentSearches(callback) {
  imageDataAccess.getRecentSearches(idUser, function(recentSearches) {
    callback(recentSearches);
  });
}

function getFavorites(callback) {
  imageDataAccess.getFavorites(idUser, function(favorites) {
    callback(favorites);
  });
}

function setImageAnnotated(imageAnnotated) {
  imageAnnotatedTemplate = imageAnnotated;
}

function setFinalImageLabeled(finalImageLabeled) {
  finalImageLabelsTemplate = finalImageLabeled;
}

function setUser(iduser) {
  idUser = iduser;
}

function transformImageLabeled() {
  if (isCustomImg()) {
    makeTemplateForCustomImg()
  } else {
    makeTemplateForWebImg();
  }
  return imgTransformed;
}

function getSearchEngineLabels() {
  let quoteWebEntity = getWebEntities();
  let quoteLogo = getLogo();
  let quotes = setQuotesToSearch(quoteLogo, quoteWebEntity);
  let promise = searchEngineClient.callSearchEngine(quotes);
  return promise;
}

function getImageFromDB(idImage) {
  let originalImage = {};
  return originalImage;
}

function saveImage(callback) {
  imageDataAccess.saveImage(idUser, imgTransformed, function(idImageSaved) {
    callback(idImageSaved);
  });
}

function requestUser(user, callback) {
  userTemplate = user;
  isUserSignedUpAlready(function(isSignedUp) {
    if (isSignedUp) {
      getUserId(function(userId) {
        callback(formatUser(userId));
      });
    } else {
      addUser(function(userId) {
        callback(formatUser(userId));
      });
    }
  });
}

function applyFilters(originalImage, filters) {
  if (filters.percentage != "") {
    let desirePercentage = filters.percentage;
    filterByPercentage(originalImage, desirePercentage);
  }
}

function filterByPercentage(originalImage, desirePercentage) {

}

function getFilters(req) {
  let filters = {
    "category": req.query.Category,
    "percentage": req.query.Percentage,
    "shops": req.query.Shops
  }
  return filters;
}

// Private Methods
function getImagesWithPopularDescriptions(images) {
  let keywords = [];
  for (var image in images) {
    let idAndKeyword = image.split("/");
    keywords.push(idAndKeyword[1]);
  };
  let keywordsSortedAndUnique = sortByFrequency(keywords);
  keywordsSortedAndUnique.forEach(function() {
    keywordsSortedAndUnique.splice(1, keywordsSortedAndUnique.length - 1);
  });
  var popularImages = {};
  for (var image in images) {
    let clave = image.split("/");
    keywordsSortedAndUnique.forEach(function(keyword) {
      if (clave[1] == keyword) {
        let ruta = clave[0] + "/" + keyword;
        popularImages[ruta] = images[ruta];
      }
    })
  }
  return popularImages;
}

function sortByFrequency(array) {
  var frequency = {};

  array.forEach(function(value) {
    frequency[value] = 0;
  });

  var uniques = array.filter(function(value) {
    return ++frequency[value] == 1;
  });

  return uniques.sort(function(a, b) {
    return frequency[b] - frequency[a];
  });
}

function setQuotesToSearch(quoteLogo, quoteWebEntity) {
  return quoteLogo + quoteWebEntity;
}

function getLogo() {
  var logoDescriptions = "";
  let quoteLogo = imageAnnotatedTemplate[0].logoAnnotations;
  quoteLogo.forEach(function(logoAnnotation) {
    logoDescriptions += logoAnnotation.description + " ";
  })
  return logoDescriptions;
}

function getWebEntities() {
  var webEntitiesDescriptions = "";
  let quoteWebEntity = imageAnnotatedTemplate[0].webDetection.webEntities;
  for (var webEntityIndex = 0; webEntityIndex < maxNumberOfDescriptionsWanted; webEntityIndex++) {
    if (!isStringEmpty(quoteWebEntity[webEntityIndex].description)) {
      webEntitiesDescriptions += quoteWebEntity[webEntityIndex].description + " ";
    }
  }
  return webEntitiesDescriptions;
}

function isUserSignedUpAlready(callback) {
  userDataAccess.isUserSignedUpAlready(userTemplate, function(isUserSignedUp) {
    callback(isUserSignedUp);
  });
}

function addUser(callback) {
  userDataAccess.addUser(userTemplate, function(userId) {
    callback(userId);
  });
}

function getUserId(callback) {
  userDataAccess.getUserId(userTemplate, function(userId) {
    callback(userId);
  });
}

function formatUser(userId) {
  let formattedUserIdResponse = {
    "idUser": userId
  }
  return formattedUserIdResponse;
}

function isCustomImg() {
  return areWebLabelsEmpty(finalImageLabelsTemplate);
}

function areWebLabelsEmpty() {
  let areEmpty = isStringEmpty(finalImageLabelsTemplate.webDetection.fullMatchingImages) &&
    isStringEmpty(finalImageLabelsTemplate.webDetection.pagesWithMatchingImages) ? true : false;
  return areEmpty;
}

function isStringEmpty(value) {
  return value == "";
}

function makeTemplateForWebImg() {
  imgTransformed = finalImageLabelsTemplate;
}

function makeTemplateForCustomImg() {
  imgTransformed = finalImageLabelsTemplate;
}

module.exports.getPopularSearches = getPopularSearches;
module.exports.setFavorites = setFavorites;
module.exports.getFavorites = getFavorites;
module.exports.getRecentSearches = getRecentSearches;
module.exports.getUserId = getUserId;
module.exports.setUser = setUser;
module.exports.saveImage = saveImage;
module.exports.requestUser = requestUser;
module.exports.getImageFromDB = getImageFromDB;
module.exports.applyFilters = applyFilters;
module.exports.getFilters = getFilters;
module.exports.transformImageLabeled = transformImageLabeled;
module.exports.setImageAnnotated = setImageAnnotated;
module.exports.setFinalImageLabeled = setFinalImageLabeled;
module.exports.getSearchEngineLabels = getSearchEngineLabels;
