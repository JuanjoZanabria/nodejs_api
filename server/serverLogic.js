const labels = require('../templates/labelsTemplates.json');
const searchEngineClient = require('../api/searchEngineClient');
const userDataAccess = require('../repository/userDataAccess');
const imageDataAccess = require('../repository/imageDataAccess');
/*
Atributos
*/
var imageAnnotatedTemplate = {};
var finalImageLabelsTemplate = {};
var imgTransformed = {
  queries: "",
  items: [Object]
};
var maxNumberOfDescriptionsWanted = 3;
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
var filteredImage = {};

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
  imgTransformed.queries = finalImageLabelsTemplate.queries;
  imgTransformed.items = finalImageLabelsTemplate.items;
  return imgTransformed;
}

function getSearchEngineLabels(seQuotes) {
  let quotes = "";
  if (seQuotes == "") {
    let quoteWebEntity = getWebEntities();
    let quoteLogo = getLogo();
    quotes = setQuotesToSearch(quoteLogo, quoteWebEntity);
  } else {
    quotes = seQuotes;
  }
  let promise = searchEngineClient.callSearchEngine(quotes);
  return promise;
}

function getImage(idImage, callback) {
  imageDataAccess.getImageById(idImage, function(mongoImage) {
    callback(mongoImage);
  });
}

function saveImage(imageBase64, callback) {
  imageDataAccess.saveImage(imageBase64, idUser, imgTransformed, function(idImageSaved) {
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
  let filterKeys = Object.keys(filters);
  filteredImage = originalImage;
  filterKeys.forEach(function(key) {
    let filterValue = filters[key];
    console.log(filterValue);
    switch (key) {
      case "percentage":
        filterByPercentage(filterValue);
      case "category":
        filterByCategory(filterValue);
      case "shops":
        filterByShops(filterValue);
      default:
        return filteredImage;
    }
  })
  return filteredImage;
}

function getFilters(req) {
  let category = req.query.category ? req.query.category : "";
  let percentage = req.query.percentage ? req.query.percentage : "";
  let shops = req.query.shops ? req.query.shops : "";
  let filters = {
    "category": category,
    "percentage": percentage,
    "shops": shops
  };
  let finalFilters = {};
  let filtersKeys = Object.keys(filters);
  let filterValues = Object.values(filters);
  filtersKeys.forEach(function(key) {
    if (filters[key] != "") finalFilters[key] = filters[key];
  })
  return finalFilters;
}

// Private Methods
function filterByPercentage(percentage) {
  let filteredByPercentageImage = filteredImage;
  filteredImage = filteredByPercentageImage;
}

function filterByCategory(category) {
  let filteredByCategoryImage = filteredImage;
  filteredImage = filteredByCategoryImage;
}

function filterByShops(shops) {
  let arrayShops = shops.split(" ");
  let filteredByShopsImage = {
    items: [String]
  };
  let positionFilteredImageItems = 0;
  let positionFilteredByShopsImageItems = 0;
  while (positionFilteredImageItems < filteredImage.content.items.length) {
    let link = filteredImage.content.items[positionFilteredImageItems].displayLink;
    let arrayLink = link.split(".");
    if (arrayShops.indexOf(arrayLink[1]) >= 0) {
      filteredByShopsImage.items[positionFilteredByShopsImageItems] = filteredImage.content.items[positionFilteredImageItems];
      positionFilteredByShopsImageItems++;
    } else if (arrayShops.indexOf(arrayLink[1]) >= 0) {
      filteredByShopsImage.items[positionFilteredByShopsImageItems] = filteredImage.content.items[positionFilteredImageItems];
      positionFilteredByShopsImageItems++;
    }
    positionFilteredImageItems++;

  }
  filteredImage = filteredByShopsImage;
}

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
  var popular = 'popular';
  popularImages[popular] = [];
  for (var image in images) {
    let clave = image.split("/");
    keywordsSortedAndUnique.forEach(function(keyword) {
      if (clave[1] == keyword) {
        let ruta = clave[0] + "/" + keyword;
        popularImages[popular].push(images[ruta]);
        //popularImages[ruta] = images[ruta];
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
  console.log("Logo "+quoteLogo)
  console.log("Web Entity "+quoteWebEntity)

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

function isStringEmpty(value) {
  return value == "";
}

module.exports.getPopularSearches = getPopularSearches;
module.exports.setFavorites = setFavorites;
module.exports.getFavorites = getFavorites;
module.exports.getRecentSearches = getRecentSearches;
module.exports.getUserId = getUserId;
module.exports.setUser = setUser;
module.exports.saveImage = saveImage;
module.exports.requestUser = requestUser;
module.exports.getImage = getImage;
module.exports.applyFilters = applyFilters;
module.exports.getFilters = getFilters;
module.exports.transformImageLabeled = transformImageLabeled;
module.exports.setImageAnnotated = setImageAnnotated;
module.exports.setFinalImageLabeled = setFinalImageLabeled;
module.exports.getSearchEngineLabels = getSearchEngineLabels;
