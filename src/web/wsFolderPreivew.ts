import fs from 'fs';
import path from 'path';
import { Socket }  from 'socket.io';
import os from 'os';

var folderTypes=[
    {
        name:"Arma",
        items:[
            {
                name:"file.txt"
            },
            {
                name: "Folder",
                children:[
                    {
                        name: "sub_file.txt"
                    },
                    {
                        name : "a",
                        children:[
                            {
                                name: "a_sub_file.txt"
                            },
                        ]
                    }
                ]
            },
            {
                name: "Folder2",
                children:[]
            }
        ]
    }
]

export class wsFolderPreview {
    Client : Socket;
    FolderPath: string;

    constructor(client : Socket){
        this.Client= client;

        this.Client.on("folderPreview:createFolder",()=>{
            this.createFolder();
        })
        this.Client.on("folderPreview:readFolder",()=>{
            this.readFolder();
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

    createFolder(){
        this.FolderPath= fs.mkdtempSync(path.join(os.tmpdir(), 'steamwd-fp-'));

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
        
        var myscheme= folderTypes[0];
        (myscheme.items).forEach(singleItem => {
            createItem(singleItem,this.FolderPath);
        });

        this.readFolder();
    }

    readFolder(){
        if(this.FolderPath && fs.existsSync(this.FolderPath))
            this.Client.emit("folderPreview:folder",this.getChilds(this.FolderPath))
    }

    
}