import { FileStatus } from "./types";

export const sleep = function(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const makeDownloadUrl= function(Statu: FileStatus){
    return "https://"+Statu.storageNode+"/prod/storage/"+Statu.storagePath+"?uuid="+Statu.uuid;
}