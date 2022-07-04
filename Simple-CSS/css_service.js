/* Module Import */
var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');

/* Definition of Constant Variable */
const CCS_URL = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";
const MY_CCS_CLIENT_ID = "{YOUR_CLIENT_ID}";
const MY_CCS_CLIENT_SECRET = "{YOUR_SECRET_KEY}";

/* Express URL Call & Work Response Data */
app.get('/css', function (req, res) {

    /* Save Text File to Variable */
    var sumText = fs.readFileSync('./ncp_ocr.txt', 'utf8').toString();

    console.log('------------ read file contents ------------');
    console.log(sumText);
    console.log('--------------------------------------------');

    var api_url = CCS_URL;
    var options = {
        url: api_url,
        form: { 
            speaker: 'mijin', 
            speed: '0', 
            text: sumText 
        },
        headers: { 
            'X-NCP-APIGW-API-KEY-ID': MY_CCS_CLIENT_ID, 
            'X-NCP-APIGW-API-KEY': MY_CCS_CLIENT_SECRET 
        }
    };

    /* Create Voice File with CSS */
    var writeStream = fs.createWriteStream('./ccs_service.mp3');
    var _req = request.post(options).on('response', function (response) {
        console.log('------------ respone status contents ------------');
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
        console.log('-------------------------------------------------');
    });

    /* Export File & Browser */
    _req.pipe(writeStream); // file로 출력
    _req.pipe(res); // 브라우저로 출력

});

/* Start Express Server */
app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/css app listening on port 3000!');
});
