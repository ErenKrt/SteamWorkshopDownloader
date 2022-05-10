import fs from 'fs';
import fse from 'fs-extra'
import path from 'path';
import { Socket }  from 'socket.io';
import os from 'os';
import { Scheme, SavedScheme } from './types'
import _ from 'lodash'
import defaultSchemes from './schemes'


var folderTypes=[
    {
        name:"Arma Workshop",
        items:[
            {
                name:"meta.cpp"
            },
            {
                name:"mod.cpp"
            },
            {
                name: "addons",
                children:[
                    {
                        name: "myMod.pbo",
                    },
                    {
                        name: "myMod.pbo.MyMod.bisign"
                    }
                ]
            },
            {
                name:"keys",
                children:[
                    {
                        name: "MyMod.bikey",
                    }
                ]
            }
        ]
    },
    {
        name:"City Skylines",
        items:[
            {
                name:"myMod.crp"
            },
            {
                name:"myMod2.crp"
            },
            {
                name:"myMod.xml"
            }
        ]
    }
];


var savedSchemes : SavedScheme[]=[
    {
        name:"Test-1",
        items:[
            {
                id:0,
                params:[
                    {
                        name:"Path",
                        value:"31"
                    }
                ]
            },
            {
                id:1,
                params:[
                    {
                        name:"Name",
                        value:"62"
                    }
                ]
            }
        ]
    },
    {
        name:"Test-2",
        items:[
            {
                id:1,
                params:[
                    {
                        name:"Name",
                        value:"31"
                    }
                ]
            },
            {
                id:0,
                params:[
                    {
                        name:"Path",
                        value:"62"
                    }
                ]
            }
        ]
    }
];

export class wsFolderPreview {
    Client : Socket;
    MainFolderPath: string;
    OrjFolderPath: string;
    SimFolderPath: string;
    SelectedFolder: number = 0;

    constructor(client : Socket){
        this.Client= client;

        this.Client.emit("folderPreview:exampleFolders",folderTypes.map(x=>x.name));
        this.Client.emit("folderPreview:savedSchemes",savedSchemes);

        this.Client.on("folderPreview:changeFolder",(name)=>{
            this.changeFolder(name);
        });

        this.Client.on("folderPreview:createFolder",()=>{
            this.createFolder();
        })
        this.Client.on("folderPreview:readFolder",()=>{
            this.readFolder();
        })
        this.Client.on("folderPreview:runSchemes",(schemes)=>{
            this.runSchemes(schemes);
        })
        this.Client.on("disconnect",()=>{
            if(this.MainFolderPath && fs.existsSync(this.MainFolderPath))
                fs.rmSync(this.MainFolderPath,{ recursive:true });
        })
    }

    getChilds(folderpath){
        var items= fs.readdirSync(folderpath, {withFileTypes: true});
        var res=[];
        items.forEach(singleItem => {
            var createNew= {
                name: singleItem.name,
                children: null
            };

            if(singleItem.isDirectory())
                createNew.children= this.getChilds(path.join(folderpath,singleItem.name));
            
            res.push(createNew);
        });

        return res;
    }

    changeFolder(name){
        var find= folderTypes.findIndex(x=>x.name==name);
        if(find!=-1){
            this.SelectedFolder= find;
            if(this.MainFolderPath && fs.existsSync(this.MainFolderPath)){
                fs.rmSync(this.MainFolderPath,{ recursive:true });
            }
            this.createFolder();
        }
    }

    createFolder(){
        this.MainFolderPath= fs.mkdtempSync(path.join(os.tmpdir(), 'steamwd-fp-'));
        this.SimFolderPath= path.join(this.MainFolderPath,"sim");
        this.OrjFolderPath= path.join(this.MainFolderPath,"orj");

        fs.mkdirSync(this.SimFolderPath);
        fs.mkdirSync(this.OrjFolderPath);

        var createItem= (Item, currentPath)=>{
            if(Item.children==null || Item.children==undefined){
                fs.closeSync(fs.openSync(path.join(currentPath,Item.name),"w"));
            }else{
                currentPath= path.join(currentPath,Item.name);
                fs.mkdirSync(currentPath);

                (Item.children).forEach(SingleChild => {
                    createItem(SingleChild,currentPath);
                });
            }
        };
        
        var myscheme= folderTypes[this.SelectedFolder];
        (myscheme.items).forEach(singleItem => {
            createItem(singleItem,this.OrjFolderPath);
        });

        this.copyOrjToSim();
        this.readFolder();
    }

    copyOrjToSim(){
        if(fs.existsSync(this.SimFolderPath)){
            fs.rmSync(this.SimFolderPath,{ recursive:true });
        }
        fse.copySync(this.OrjFolderPath,this.SimFolderPath,{ overwrite:true });
    }

    readFolder(){
        if(this.SimFolderPath && fs.existsSync(this.SimFolderPath))
            this.Client.emit("folderPreview:mainFolder",this.MainFolderPath);
            this.Client.emit("folderPreview:folder",this.getChilds(this.SimFolderPath))
    }

    runSchemes(schemes: Scheme[]){
        this.copyOrjToSim();

        if(schemes==null || schemes.length<=0){
            this.readFolder();
            return;
        }

        let executeAll= (scheme,myscheme)=>{
            if(myscheme.childs && myscheme.childs.length > 0){
                if(scheme.execute(myscheme.params.map((x)=>{
                    if(path.isAbsolute(x.value)){
                        return x.value;
                    }else return path.join(this.SimFolderPath,x.value)
                }))===true){
                    (myscheme.childs).forEach(singleChild => {
                        var bul= defaultSchemes.find(x=>x.id==singleChild.id);
                        if(bul!=null) executeAll(bul,singleChild);
                    });
                }
            }else{
                scheme.execute(myscheme.params.map((x)=>{
                    if(path.isAbsolute(x.value)){
                        return x.value;
                    }else return path.join(this.SimFolderPath,x.value)
                }));
            }
        }

        try {
            schemes.forEach(SingleScheme => {
                var find= defaultSchemes.find(x=>x.name==SingleScheme.name);
                if(find)
                    executeAll(find,SingleScheme);
            });
        } catch (error) {
            this.sendError(error.message);
        }

        this.readFolder();
    }

    sendError(msg){
        this.Client.emit("folderPreview:error",msg);
    }
    
}