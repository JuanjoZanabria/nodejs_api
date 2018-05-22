const labels = require('./labelsTemplates.json');

/*
Atributos
*/
var userTemplate = {
  fullName: "",
  email: "",
  profilePicture: ""
};

var imageAnnotatedTemplate = {};

//Public Methods
function getUser(user) {
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
}

function getFilters(req) {
  let filters = {
    "category": req.query.Category,
    "percentage": req.query.Percentage,
    "shops": req.query.Shops
  }
  return filters;
}

function transformImageAnnotated(imageAnnotated) {
  imageAnnotatedTemplate = imageAnnotated;
  let imageTransformed = isCustomImg() ? makeTemplateForCustomImg() : makeTemplateForWebImg();
  return imageTransformed;
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
  return areWebLabelsEmpty(imageAnnotatedTemplate);
}

function areWebLabelsEmpty(imageAnnotatedTemplate) {
  //console.log("AreWebLabels: " + imageAnnotatedTemplate[0].webDetection.fullMatchingImages[0].url);
  //console.log("AreWebLabels: " + imageAnnotatedTemplate[0].labels.webLabels.fullMatchingImages);
  let areEmpty = isStringEmpty(imageAnnotatedTemplate[0].webDetection.fullMatchingImages[0].url) &&
    isStringEmpty(imageAnnotatedTemplate[0].webDetection.pagesWithMatchingImages[0].url) ? true : false;
  return areEmpty;
}

function isStringEmpty(value) {
  return value == "";
}

//ambas funciones tiene que juntar etiquetas del searchengine junto con el api GoogleVision
//y montar un json nuevo transformado para devolver al postman. Las etiquetas que valen para cada caso estan
//filterByPercentage
function makeTemplateForWebImg() {
  return {Hey : "hola"};
}

function makeTemplateForCustomImg() {

}

module.exports.getUser = getUser;
module.exports.getImageFromDB = getImageFromDB;
module.exports.applyFilters = applyFilters;
module.exports.getFilters = getFilters;
module.exports.transformImageAnnotated = transformImageAnnotated;
