/* Import 'axios' module */
var express = require('express');
/* Import 'axios' module */
const axios = require('axios');
/* Encoding QueryString */ 
const qs = require('querystring');
/* Import File Stream */
var fs = require('fs');
var app = express();

/* Definition of Cliend ID & Secret Key Variable */
// var client_id = '{YOUR_NMT_CLIENT_ID}';
// var client_secret = '{YOUR_NMT_SECRET_KEY}';
var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';

app.get('/naverSearchAPI/:query', function (req, res) {

  console.log('::: naverSearchAPI is called.');
  console.log('::: Search Keyword : ' + req.params.query);

  /* Definition of NAVER Search Open API Cliend ID & Secret Key Variable */
  var config = {
    headers: {
      'X-Naver-Client-Id' : '{YOUR_NAVER_SEARCH_CLIENT_ID}',
      'X-Naver-Client-Secret' : '{YOUR_NAVER_SEARCH_SECRET_KEY}'
    }
  };

  var textStr = '';
  var resultStr;
  /* for Browser Print */
  var htmlStr = '<p><b><font color="orange">[ Search Keyword ]</font></b></p>'+
                '<b>' + req.params.query + '</b><br><br>' +
                '<p><b><font color="blue">[ (KR) Original Sarch Result ]</font></b></p>';

  /* NAVER Search NEWS API */
  axios.get(
    `https://openapi.naver.com/v1/search/news.json?query=${qs.escape(req.params.query)}&display=1&start=1&sort=date`,
    config
  )
    .then( response=>{
     
      res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });

      console.log('----------------');
      console.log('response' + response);
      
      /* PapagoNMT Setting variables */
      var koResultArray = [];
      
      /* Make for Browser HTML String */
      for ( var i=0 ; i < response.data.items.length; i++) {
        htmlStr += response.data.items[i].description + '<br>';
        textStr += response.data.items[i].description + '.';
        console.log(textStr);

        koResultArray.push(response.data.items[i].description);
      }

      htmlStr += '<br><p><b><font color="green">[ (EN) Translated Search Result ]</font></b></p>';

      var message = "";

      /* Promise() : PapagoNMT Execute & Result */
      var papagoNMTResult = new Promise((resolve, reject) => {

        var api_url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
        var request = require('request');

        // PapagoNMT HTTP Options
        var options = {
            url: api_url,
            form: {'source':'ko', 'target':'en', 'text':textStr},
            headers: {
              'X-NCP-APIGW-API-KEY-ID':client_id, 
              'X-NCP-APIGW-API-KEY': client_secret,
              'Content-Type': 'application/json'
            }
        };

        request.post(options, function (error, response, body) {   
          message = JSON.parse(body);
          // retrun callback function
          resolve(message);
        });

      })

      /* PapagoNMT 실행 후 번역된 텍스트를 파일로 저장 */
      var papagoResult = (results) => { 
        resultStr = JSON.stringify(results);
        var resultJSON = results[0].message.result.translatedText;

        htmlStr += resultJSON + '<br><br>';

        fs.unlink('./trans_text_file/translatedText.txt');
        fs.appendFileSync('./trans_text_file/translatedText.txt', resultJSON);

        res.write(htmlStr);
        res.end();
      }

      var cssResult = (results) => { 
        console.log('cssResult is called');
      }

      // Execute Promise.all() 
      Promise.all([papagoNMTResult]).then(papagoResult);

    })
    .catch( error =>{
      console.log( error );
    })

});

app.listen(3000, function () {
  console.log('::: MyTranlation Service App listening on port 3000!');
});