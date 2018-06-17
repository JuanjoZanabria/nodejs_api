const https = require('https');

var apiKey = "?key=AIzaSyANKZcPxLG3EPNCSdB8M-9jH9S_PljSoU4";
var customSearchEngine = "&cx=014899129568475050489:mzgfwcuvxte";

function callSearchEngine(quotes) {
  return new Promise(function(resolve) {
    https.get('https://www.googleapis.com/customsearch/v1' + apiKey + customSearchEngine + "&q=" + quotes,
     function(response) {
      response.setEncoding('utf8');
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        resolve(JSON.parse(data));
      });
    });
  })
}

module.exports.callSearchEngine = callSearchEngine;
