// 네이버 Papago NMT API 예제
var express = require('express');
var app = express();
// PapagoNMT API Cliend_Id & Secret Key
var client_id = '{YOUR_NAVER_SEARCH_CLIENT_ID}';
var client_secret = '{YOUR_NAVER_SEARCH_SECRET_KEY}';

var query;
var resultStr;

module.exports =  {

    papagoNMTTranslation: function(queryStr,callback) {
        console.log('::: papagoNMTTranslation() is called.');

        query = queryStr;

        var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
        var request = require('request');

        // PapagoNMT HTTP Options
        var options = {
            url: api_url,
            form: {'source':'ko', 'target':'en', 'text':query},
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };

        request.post(options, function (error, response, body) {   
            resultStr = JSON.parse(body);
            // retrun callback function
            return callback(resultStr) ;
        });
    }
}
