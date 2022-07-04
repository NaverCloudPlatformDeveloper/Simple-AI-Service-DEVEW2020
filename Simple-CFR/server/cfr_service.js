/* Module Import */
var express = require('express');
var app = express();

/* Definition of Constant Variable */
// var client_id = '{YOUR_CLIENT_ID}';
// var client_secret = '{YOUR_SECRET_KEY}';

var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';

/* Express URL Call & Work Response Data */
var fs = require('fs');
app.get('/face', function (req, res) {
  var request = require('request');
  //var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/celebrity'; // 유명인 인식
  var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face'; // 얼굴 감지

  var _formData = {
    image:'image',
    image: fs.createReadStream('/usr/local/Cellar/nginx/1.19.2/html/han.jpg') // original image file
  };
  
  var _req = request.post({url:api_url, formData:_formData,
    headers: {
        'X-NCP-APIGW-API-KEY-ID':client_id, 
        'X-NCP-APIGW-API-KEY': client_secret, 
        'Content-Type': 'multipart/form-data'
    }
  }).on('response', function(response) {
    console.log(response.statusCode)
    console.log(response.headers['content-type'])
  });
    console.log( request.head  );
    _req.pipe(res); // 브라우저로 출력
});

/* Start Express Server */
app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/face app listening on port 3000!');
});

