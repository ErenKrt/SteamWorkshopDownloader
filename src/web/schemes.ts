import { Scheme } from './types'
import fs from "fs-extra";
import glob from 'glob';
import path from 'path';

let isFile= (name)=>{
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
        execute: (params)=>{
            if(isFile(params[0])){
                if(fs.existsSync(params[0])) fs.unlinkSync(params[0]);
                fs.openSync(params[0],'w');
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
        execute: (params)=>{
            if(!params[0] || !params[1]) return;
            if(!fs.existsSync(params[1])) fs.mkdirSync(params[1]);

            if(isFile(params[0])){ // Files

                var files= glob.sync(params[0]);
                
                if(files.length > 0)
                    files.forEach(file => {
                        var fileName= path.basename(file);
                        fs.copyFileSync(file,path.join(params[1],fileName));
                    });

                }else{ // Folder
                    fs.copySync(params[0],params[1]);
                }
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