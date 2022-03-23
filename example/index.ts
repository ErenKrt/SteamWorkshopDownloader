import { Client } from '../src/api'

import { FileStatus } from '../src/api/types'

import { makeDownloadUrl } from '../src/api/utils'

import Downloader from 'nodejs-file-downloader'

var MyClient= new Client();


(async function(){
    
    var items= await MyClient.getItems([2712258971]);
    var res= await MyClient.getFilesFromItems(items.data,(Statu)=>{
        console.log(items.data.find(x=>x.publishedfileid==Statu.publishedfileid).title_disk_safe+" => %"+Statu.progress+" | "+Statu.status);
    });

    let downloads=[];

    res.data.forEach(async (Single : FileStatus) => {
        const downloader = new Downloader({
            url: makeDownloadUrl(Single),
            directory: "./downloads",
            onProgress : function (percentage, chunk, remainingSize) {
                console.log("% ", percentage);
                console.log("Remaining bytes: ", remainingSize);
            },
        });
        
        downloads.push(downloader.download());
    });

    await Promise.all(downloads);

    console.log("ALL DOWNLOADED");


})()