const vision = require('@google-cloud/vision');
const credentials = {
  keyFilename: '../gaptfgkey.json'
};
const client = new vision.ImageAnnotatorClient(credentials);

//'gs://gapbbdd/IMG_6577_ok.jpg'
function setRequest(imageBase64) {
  let request = {
    image: {
      content: imageBase64
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

module.exports.setRequest = setRequest;
module.exports.getImageAnnotated = getImageAnnotated;
