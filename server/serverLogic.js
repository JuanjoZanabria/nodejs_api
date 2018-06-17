const labels = require('../templates/labelsTemplates.json');
const searchEngineClient = require('../api/searchEngineClient');
const userDataAccess = require('../repository/userDataAccess');
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

//Public Methods
function setImageAnnotated(imageAnnotated) {
  imageAnnotatedTemplate = imageAnnotated;
}

function setFinalImageLabeled(finalImageLabeled) {
  finalImageLabelsTemplate = finalImageLabeled;
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

function requestUser(user) {
  console.log("Request user");
  userTemplate = user;
  //let userId = isUserSignedUpAlready() ? getUserId() : addUser();
   let userId = getUserId();
  console.log("RequestUserID "+ userId);
  return formatUser(userId);
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

function isUserSignedUpAlready() {
  userDataAccess.openConnection();
  let isUserSignedUpAlready = userDataAccess.isUserSignedUpAlready(userTemplate);
  userDataAccess.closeConnection();
  return isUserSignedUpAlready;
}

function addUser() {
  userDataAccess.openConnection();
  let userAddedId = userDataAccess.addUser(userTemplate);
  userDataAccess.closeConnection();
  return userAddedId;
}

function getUserId() {
  userDataAccess.openConnection();
  let userId = userDataAccess.getUserId(userTemplate);
  console.log("Get userId: " + userId);
  userDataAccess.closeConnection();
  return userId;
}

function formatUser(userId) {
  console.log("Format user id: " + userId);
  let formattedUserIdResponse = {
    "idUser": userId
  }
  return formattedUserIdResponse;
}

function isCustomImg() {
  return areWebLabelsEmpty(finalImageLabelsTemplate);
}

function areWebLabelsEmpty() {
  console.log(finalImageLabelsTemplate);
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

module.exports.requestUser = requestUser;
module.exports.getImageFromDB = getImageFromDB;
module.exports.applyFilters = applyFilters;
module.exports.getFilters = getFilters;
module.exports.transformImageLabeled = transformImageLabeled;
module.exports.setImageAnnotated = setImageAnnotated;
module.exports.setFinalImageLabeled = setFinalImageLabeled;
module.exports.getSearchEngineLabels = getSearchEngineLabels;
