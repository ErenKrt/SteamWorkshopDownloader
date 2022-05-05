import { Scheme } from './types'
import fs from "fs-extra";
import glob from 'glob';
import path from 'path';

let isFile= (fullPath)=>{
    var name= path.basename(fullPath);
    if(name.includes('.')) return true;
    else return false;
}

var schemes:Scheme[] = [
    {
        id:0,
        name:"Delete",
        description:"Delete file or folder",
        params:[
            {
                name:"Path"
            }
        ],
        acceptChilds:false,
        execute: (params)=>{
            if(params[0] && fs.existsSync(params[0]))
                fs.unlinkSync(params[0]);
        }
    },
    {
        id:1,
        name:"Create",
        description:"Create file or folder",
        params:[
            {
                name:"Name"
            }
        ],
        acceptChilds:false,
        execute: (params)=>{
            if(isFile(params[0])){
                if(fs.existsSync(params[0])) fs.unlinkSync(params[0]);
                fs.closeSync(fs.openSync(params[0],"w"));
            }else{
                if(fs.pathExistsSync(params[0])) fs.rmdirSync(params[0]);
                fs.mkdirsSync(params[0]);
            }
        }
    },
    {
        id:2,
        name:"Copy",
        description:"Copy files or folders",
        params:[
            {
                name:"From Path / Glob",
            },
            {
                name:"To Path / Folder",
            }
        ],
        acceptChilds:false,
        execute: (params)=>{
            if(!params[0] || !params[1]) return;
            //if( isFile(params[1]) && !fs.existsSync(params[1])) fs.mkdirSync(params[1]);

            var items= glob.sync(params[0]);

            var copyPath= params[1];
            var fileToFolder= false;

            if(!isFile(copyPath)){
                if(!fs.existsSync(copyPath)) fs.mkdirSync(copyPath);
                fileToFolder=true;
            }

            items.forEach(SingleItem => {
                if(fileToFolder){
                    var lastName= path.basename(SingleItem);
                    if(isFile(lastName))
                        fs.copyFileSync(SingleItem,path.join(copyPath,lastName));
                    else
                        fs.copySync(SingleItem,copyPath)
                } 
                else fs.copySync(SingleItem,copyPath);
            });
            
        }
    },
    {
        id:3,
        name:"Has",
        description:"Check file or folder exists in workshop",
        params:[
            {
                name:"File / Glob"
            }
        ],
        acceptChilds: true,
        execute: (params)=>{
            if(isFile(params[0])){
                var files= glob.sync(params[0]);
                return (files.length > 0);
            }else{
                return fs.pathExistsSync(path.join(params[0]));
            }
        }
    },
];


export default schemes