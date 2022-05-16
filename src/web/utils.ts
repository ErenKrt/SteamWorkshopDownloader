import fs from "fs";
import { FileInfo } from './types'
import FileHound from 'filehound';


export const getFolders= (appPath)=>{
    const filehound = FileHound.create();
    filehound
        .path(appPath)
        .directory()
        .depth(3);

    var folders= filehound.findSync();

    var res: FileInfo[]=[];
    folders.forEach(folder => {
        let fileInfo: FileInfo = {};
        fileInfo.path= folder;
        try {
            fs.accessSync(folder,fs.constants.W_OK | fs.constants.R_OK);
            fileInfo.canAccess=true;
        } catch (error) {
            fileInfo.canAccess=false;
        }
        res.push(fileInfo);
    });
    return res;
}

export const getAllDepIDS = async (MyClient,baseIDS)=>{
    let lookIDS=baseIDS;
    let willDownloadedIDS=[];
    let fetchedItems = [];

    do {
        willDownloadedIDS = willDownloadedIDS.concat(lookIDS);
        
        var items = await MyClient.getItems(lookIDS);
        if (items.success == false) return;

        fetchedItems = fetchedItems.concat(items.data);
        

        var HasChilds = items.data.filter(x => x.children != null && x.children.length > 0);
        
        if (HasChilds.length > 0) {

            lookIDS = [];

            HasChilds.forEach(SingleItem => {
                var NewIDS= lookIDS.concat(SingleItem.children.map(x => x.publishedfileid));
                NewIDS.forEach(SingleID => {
                    if(willDownloadedIDS.includes(SingleID)===false && lookIDS.includes(SingleID)===false){
                        lookIDS.push(SingleID);
                    }
                });
            });

        } else {
            lookIDS = null;
        }


    } while (lookIDS != null);

    return {
        IDS:willDownloadedIDS,
        Items:fetchedItems
    };
};

export const writeParams= (text,params) => {
    const keys= Object.keys(params);

    const isHaveKey=(key)=>{
        return keys.includes(key) && params[key]!=null && params[key]!=undefined;
    }

    const regex = /{(.*?)}/g;
    const result= [...text.matchAll(regex)];

    if(result && result.length > 0){
        result.forEach(findedRegex => {
            var fullParam= findedRegex[0];
            var innerParam= findedRegex[1];

            var paramValue=null;

            if(innerParam.includes('||')){
                var split= innerParam.split('||');
                for (var key in split) {
                    var multikey= split[key].replace(" ","");
                    if(isHaveKey(multikey)){
                        paramValue=params[multikey];
                        break;
                    }
                }
            }else{
                var innerkey= innerParam.replace(" ","");
                if(isHaveKey(innerkey)){
                    paramValue=params[innerkey];
                }
            }

            

            if(paramValue!=null){
                text= text.replace(fullParam,paramValue);
            }

        });
    }
    console.log(text);
    return text;
}