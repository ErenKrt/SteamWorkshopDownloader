const {Downloader}= require('../Src/Main.js');
const path= require('path');

var DownClient= new Downloader();


(async function(){
    var Down= await DownClient.Download("450814997",path.resolve("./dosya/"),function(data){
        console.log(data);
    });

    console.log(Down);
    console.log("Downloaded");
})()
