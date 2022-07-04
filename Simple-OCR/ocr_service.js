/* Module Import */
const axios = require('axios');
const fs = require('fs');

/* Definition of Constant Variable */
const MY_OCR_API_URL = "{YOUR_API_GATEWAY_URL}";
const MY_OCR_SECRET_KEY = "{YOUR_SECRET_KEY}";

/* Definition of Headers, Required Variable */
let config = {
    headers: {
        "Content-Type" : "application/json",
        "X-OCR-SECRET" : MY_OCR_SECRET_KEY
    }
}

let timestamp = new Date().getTime();
let sumText = "";

/* Axios URL Call & Work Response Data */
axios.post(MY_OCR_API_URL, 
    {
    "images": [
        {
            "format": "png",
            "name": "medium",
            "data": null,
            "url": "https://kr.object.ncloudstorage.com/maso-storage/source_image.png"
        }
    ],
    "lang": "ko",
    "requestId": "string",
    "resultType": "string",
    "timestamp": timestamp,
    "version": "V1"
    }, config)
  .then(function (response) {

    /* Make Response Data to Text Data */
    response.data.images[0].fields.forEach(element => {
        console.log(element.inferText);
        sumText += " " + element.inferText;
    });

    console.log("-------------------");
    console.log(sumText);
    console.log("-------------------");

    /* Save Text File */
    fs.writeFileSync('ncp_ocr.txt', sumText,'utf-8');

  })
  .catch(function (error) {
    console.log(error);
  });
