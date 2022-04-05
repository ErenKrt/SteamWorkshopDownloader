// Web API Router sınıfımız

import path from "path";
import glob from 'glob';
import fs from 'fs';

// gerekli modülleri tanımlıyoruz
var express = require('express')
var operator = express.Router() 


// HTTP Get talebi için tüm kontakların listesini dönüyoruz
operator.route('/').get(function (req, res, next) {
    res.json({a:5});
})

operator.route('/getPaths').get(function(req, res, next){
    var mpath= path.resolve(process.cwd());
    var merge= path.join(mpath,"*");
    var datas= glob.sync(merge);

    datas.forEach(SPath => {
        console.log(SPath);
        try {
            fs.accessSync(SPath,fs.constants.W_OK);
            console.log("CAN ACCESS");
        } catch (error) {
            console.log("CANT ACCESS");
        }
    });
    
    res.json(datas);
});

export default operator