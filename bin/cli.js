#!/usr/bin/env node

const argv = process.argv.slice(2)
var {Downloader}= require('../dist');
var path= require('path');

(async function(){
    var DownClient = new Downloader();
    var Downloadeds= await DownClient.Download(argv,path.resolve(process.cwd()));
    console.log(Downloadeds);
})();