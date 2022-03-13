import {Downloader} from '../src'
import { Info } from '../src/interfaces';

var MyDown= new Downloader();

async function DownAll(Workshop : Info){
    var WorkShopIDs:number[] = [];
    if(Workshop.fileType!=2){
        WorkShopIDs.push(Workshop.id);
    }

    if(Workshop.childs!=null && Workshop.childs.length > 0){
        Workshop.childs.forEach(SingleChild => {
            WorkShopIDs.push(SingleChild.id);
        });
    }
    
    await MyDown.Download(WorkShopIDs,"./downs/");
}

(async function(){
    var Down= await MyDown.Info([2276588418]);

    if(Down.data==null || Down.data.length <= 0){
        console.log("Cant find  workshop infos !!!");
    }
    
    Down.data!.forEach(async Workshop => {
        await DownAll(Workshop);
    });


    //var Parent= await MyDown.Info([2749243244]);
    
    //await MyDown.Download([2749243244,2749243244]);
    //var Down= await MyDown.Download([2712258971,2712258978],"./downs/");

    //console.log(Down);
})()