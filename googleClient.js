const vision = require('@google-cloud/vision');
const credentials = {
  keyFilename: '../gaptfgkey.json'
};
const client = new vision.ImageAnnotatorClient(credentials);

//'gs://gapbbdd/IMG_6577_ok.jpg'
function setRequest(imageUri) {
  let request = {
    image: {
      source: {
        imageUri: imageUri
      }
    },
    features: [{
        type: "WEB_DETECTION"
      },
      {
        type: "LABEL_DETECTION"
      },
      {
        type: "SAFE_SEARCH_DETECTION"
      },
      {
        type: "LOGO_DETECTION"
      },
      {
        type: "IMAGE_PROPERTIES"
      }
    ],
  }
  return JSON.stringify(request);
}

function getImageAnnotated(request) {
  let googlePromise = client
    .annotateImage(JSON.parse(request));
    return googlePromise;
}

function print(str) {
  console.log(str);
}

module.exports.setRequest = setRequest;
module.exports.getImageAnnotated = getImageAnnotated;
module.exports.print = print;
