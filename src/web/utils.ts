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