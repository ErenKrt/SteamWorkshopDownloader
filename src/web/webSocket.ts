import { Server, Socket }  from 'socket.io';
import { Session } from './types';
import { wdClient } from './index';
import Downloader from "nodejs-file-downloader"
import { makeDownloadUrl } from '../api/utils';
import os from 'os'
import path from 'path';
import fs, { readdirSync, rmSync } from 'fs';
import { wsFolderPreview } from './wsFolderPreivew'
import AdmZip  from 'adm-zip'
import config from './config';
import { execute } from './schemeRenderer'

export class WebSocket{
    private server: Server;
    private sessions: Session[];

    constructor(srv){
        this.sessions=[];
        
        this.server= new Server(srv,{
            cors:{
                origin: "*"
            }
        });
        
        this.server.on("connection",(socket)=>this.connection(socket))
    }

    getSession(ID: string){
        return this.sessions.find(x=>x.socket.id==ID);
    }

    connection(client : Socket){
        console.log("Connected: "+client.id);
        
        this.sessions.push({
            socket: client,
            items:[],
            previewFolder: new wsFolderPreview(client)
        });

        client.on("download",(args)=>{
            this.download(this.getSession(client.id),args.scheme, args.items);
        })

        client.on("disconnect",()=>{
            var index= this.sessions.findIndex(x=>x.socket.id==client.id);
            if(index!=-1)
                this.sessions.splice(index,1);
        });

    }

    error(session: Session, error){
        session.socket.emit("error",{
            title: error.title,
            description: error.description
        });
    }
    
    async download(session: Session, scheme, Items){
        var files= await wdClient.getFiles(Items.map(x=>x.publishedfileid),(statu)=>{
            session.socket.emit("statu",
                {
                    publishedfileid:statu.publishedfileid,
                    progress: statu.progress,
                    progressText: statu.progressText
                }
            );
        });

        if(files.success==false){
            this.error(session,{
                title:"Error",
                description: files.message
            })
            return;
        }
        let getItemName= (ID)=>{
            return Items.find(x=>x.publishedfileid==ID)?.title_disk_safe;
        };

        let downs= [];

        (files.data).forEach(x => {
            var itemName= getItemName(x.publishedfileid);

            var down = new Downloader({
                url: makeDownloadUrl(x),
                directory: "./",
                onProgress: function (percentage, chunk, remainingSize) {
                    session.socket.emit("statu",{
                        publishedfileid:x.publishedfileid,
                        progress: percentage,
                        progressText: "Downloading %"+percentage
                    })
                },
                onBeforeSave: ()=>{
                    return itemName+".zip";
                }
            });
            
            downs.push(down.download().then(()=>{
                var workshopFolderPath= path.join(config.baseConfig.currentPath,itemName);

                var zip= new AdmZip(path.join(config.baseConfig.currentPath,itemName+".zip"));
                zip.extractAllTo(workshopFolderPath);
                rmSync(path.join(config.baseConfig.currentPath,itemName+".zip"),{recursive:true, force: true});

                if(scheme && config.savedSchemesConfig.find(x=>x.name==scheme)!=null){
                   execute(workshopFolderPath,config.savedSchemesConfig.find(x=>x.name==scheme).items,Items.find(x=>x.publishedfileid==x.publishedfileid))
                }

            }));
        });

        await Promise.all(downs);

        session.socket.emit("prepared",files.data);
    }
}