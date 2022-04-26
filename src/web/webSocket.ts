import { Server, Socket }  from 'socket.io';
import { Session } from './types';
import { wdClient } from './index';
import Downloader from "nodejs-file-downloader"
import { makeDownloadUrl } from '../api/utils';
import os from 'os'
import path from 'path';
import fs, { readdirSync } from 'fs';
import fse from 'fs-extra'


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
        });

        
        client.on("folderPreview:createFolder",()=>{
            this.createFolder(this.getSession(client.id));
        })
        client.on("folderPreview:readFolder",()=>{
            this.readFolder(this.getSession(client.id));
        })

        client.on("download",(args)=>{
            this.download(this.getSession(client.id),args);
        })

        client.on("disconnect",()=>{
            var index= this.sessions.findIndex(x=>x.socket.id==client.id);
            if(index!=-1)
                if(this.sessions[index].previewFolder!=null && this.sessions[index].previewFolder!=undefined)
                    fs.rmSync(this.sessions[index].previewFolder,{recursive:true})
                this.sessions.splice(index,1);
        });

    }

    error(session: Session, error){
        session.socket.emit("error",{
            title: error.title,
            description: error.description
        });
    }

    createFolder(session: Session){
        var tempDir= fs.mkdtempSync(path.join(os.tmpdir(), 'steamwd-fp-'));
        session.previewFolder= tempDir;

        var files=["text.txt","text.png","text.json"];
        files.forEach(singleFile => {
            var ID= fs.openSync(path.join(tempDir,singleFile),"w");
            fs.closeSync(ID);
        });

        this.readFolder(session);
    }

    getChilds(folderpath){
        var items= readdirSync(folderpath, {withFileTypes: true});
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

    readFolder(session: Session){
        var folder= this.getChilds(session.previewFolder);
        if(folder)
            session.socket.emit("folderPreview:folder",folder)
    }

    async download(session: Session, IDS: number[]){

        var files= await wdClient.getFiles(IDS,(statu)=>{
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

        let downs= [];

        (files.data).forEach(x => {
                
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
            });
    
            downs.push(down.download());
        });

        await Promise.all(downs);

        session.socket.emit("prepared",files.data);
    }
}