// Web API Router sınıfımız
// gerekli modülleri tanımlıyoruz
var express = require('express')
var operator = express.Router() 


// HTTP Get talebi için tüm kontakların listesini dönüyoruz
operator.route('/').get(function (req, res, next) {
    res.json({a:parseInt(5)});
})
 
module.exports = operator