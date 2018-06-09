const labels = require('./labelsTemplates.json');
const searchEngineClient = require('./searchEngineClient');

/*
Atributos
*/
var userTemplate = {
  fullName: "",
  email: "",
  profilePicture: ""
};

var imageAnnotatedTemplate = {};
var finalImageLabelsTemplate = {};
var imgTransformed = {};

//Public Methods
function setImageAnnotated(imageAnnotated) {
  imageAnnotatedTemplate = imageAnnotated;
}

function setFinalImageLabeled(finalImageLabeled) {
  finalImageLabelsTemplate = finalImageLabeled;
}

function requestUser(user) {
  userTemplate = user;
  let userId = isUserSignedUpAlready() ? getUserId() : addUser();
  return formatUser(userId);
}

function getImageFromDB(idImage) {
  let originalImage = {};
  return originalImage;
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

function transformImageLabeled() {
  if (isCustomImg()) {
    makeTemplateForCustomImg()
  } else {
    makeTemplateForWebImg();
  }
  return imgTransformed;
}

function getSearchEngineLabels() {
  let quoteLogo = imageAnnotatedTemplate[0].logoAnnotations.description;
  let quoteWebEntity = imageAnnotatedTemplate[0].webDetection.webEntities[0].description;
  let promise;
  if (!isStringEmpty(quoteLogo)) {
    promise = searchEngineClient.callSearchEngine(quoteWebEntity);
  } else {
    promise = searchEngineClient.callSearchEngine(quoteLogo);
  }
  return promise;
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
    "idUser": userId
  }
  return formattedUserIdResponse;
}

function isCustomImg() {
  return areWebLabelsEmpty(finalImageLabelsTemplate);
}

function areWebLabelsEmpty() {
  //console.log("AreWebLabels: " + imageAnnotatedTemplate[0].webDetection.fullMatchingImages[0].url);
  //console.log("AreWebLabels: " + imageAnnotatedTemplate[0].labels.webLabels.fullMatchingImages);
  console.log(finalImageLabelsTemplate);
  let areEmpty = isStringEmpty(finalImageLabelsTemplate.webDetection.fullMatchingImages) &&
    isStringEmpty(finalImageLabelsTemplate.webDetection.pagesWithMatchingImages) ? true : false;
  return areEmpty;
}

function isStringEmpty(value) {
  return value == "";
}



//console.log(imageAnnotatedTemplate);
//ambas funciones tiene que juntar etiquetas del searchengine junto con el api GoogleVision
//y montar un json nuevo transformado para devolver al postman. Las etiquetas que valen para cada caso estan
//webDetection.webEntities.description con el score
//webDetection.BestGuessLabels
//webDetection.fullMatchingImages.url y recortar / enlace tienda
//webDetection.pagesWithMatchingImages.url y el fullMatchingImages.url
//logoAnnotations.description

//webDetection.webEntities.description con el score
//webDetection.BestGuessLabels
//logoAnnotations.description
//https://www.googleapis.com/customsearch/v1?key=AIzaSyANKZcPxLG3EPNCSdB8M-9jH9S_PljSoU4&cx=014899129568475050489:mzgfwcuvxte&q=t-shirt adidas logo cavaliers
//key=AIzaSyANKZcPxLG3EPNCSdB8M-9jH9S_PljSoU4
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
