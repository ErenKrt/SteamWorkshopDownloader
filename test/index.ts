import {Downloader} from '../src'

var MyDown= new Downloader();

//MyDown.Download();

(async function(){
    //console.log(await MyDown.Info([274974446]));
    //var Parent= await MyDown.Info([2749243244]);
    
    //await MyDown.Download([2749243244,2749243244]);
    var Down= await MyDown.Download([2712258971,2712258978],"./downs/");

    console.log(Down);
})()