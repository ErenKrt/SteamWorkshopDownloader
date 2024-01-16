import axios, { AxiosInstance, Method } from 'axios';

import { ClientConfig, Result, Item, GetFileCallback, GetFileUUID, FileStatus } from "./types";
import { defaultConfig, endpoints } from './const'
import { sleep } from './utils';

export class Client{
    private config:ClientConfig;
    private client:AxiosInstance;

    constructor(config? : ClientConfig){
        this.config= {...defaultConfig, ...config};
        

        this.client= axios.create({
            baseURL:`https://${this.config.apiVersion}.steamworkshopdownloader.io/${this.config.apiPrefix}/`,
            headers:{
                "User-Agent":this.config.userAgent
            }
        })
    }

    private async request<T>(method: Method,url: string, data: any): Promise<Result<T>>{
        try {
            const response= await this.client({
                method,
                url,
                data
            });

            return {
                success:true,
                data: response.data as T
            }

        } catch (error) {
            return {
                success:false,
                data:null,
                message: error.message
            } 
        }
    }

    private async fileRequest(files:Item[]) : Promise<Result<GetFileUUID[]>>{

        let UUIDS: GetFileUUID[] = [];
        let requests=[];

        try {
            files.forEach(item => {
                var req= this.request<GetFileUUID>("POST",endpoints.download,{
                    publishedFileId:Number(item.publishedfileid),
                    collectionId:null,
                    hidden:false,
                    downloadFormat:item.download_format,
                    autodownload:false
                }).then(x=>{
                    if(x.success && x.data!=null)
                        UUIDS.push({
                            publishedfileid: item.publishedfileid,
                            ...x.data
                        });
                })
                requests.push(req);
            });
    
            await Promise.all(requests);
        } catch (error) {
            return {
                success:false,
                message:error.message
            }
        }

        return {
            success:true,
            data:UUIDS,
        };
    }

    async getItems(filesIDs:number[]) : Promise<Result<Item[]>>{
       return await this.request("POST",endpoints.file,`[${filesIDs.toString()}]:`);
    }
    async getStatus(UUIDS: GetFileUUID[]) : Promise<Result<FileStatus[]>>{
        const request= await this.request<FileStatus[]>("POST",endpoints.status,{uuids:UUIDS.map(x=>x.uuid)});
        if(request.success==false) return request;

        let response : FileStatus[]= [];

        var StatusUIDS= Object.keys(request.data);
        StatusUIDS.forEach(SingleUUID => {
            response.push({
                uuid: SingleUUID,
                publishedfileid: UUIDS.find(x=>x.uuid==SingleUUID).publishedfileid,
                ...request.data[SingleUUID]
            });
        });

        return {
            success:true,
            data: response
        }
    }

    async getFilesFromItems(items:Item[], cb?: GetFileCallback) : Promise<Result<any>>{

        const UUIDS= await this.fileRequest(items);
        if(UUIDS.success==false) return UUIDS;

        let status : Result<FileStatus[]>= null;
        do {
            status= await this.getStatus(UUIDS.data);
            if(status.success==false) break;
            
            if(cb!=null && typeof cb == "function"){
                (status.data).forEach(SingleStatu => {
                    cb(SingleStatu);
                });
            }
            
            await sleep(500);
        } while ( status.data==null || status.data.filter(x=>x.status=="prepared").length != status.data.length);
        
        return {
            success:true,
            data:status.data
        }
    }

    async getFiles(filesIDs:number[], cb?: GetFileCallback) : Promise<Result<any>>{

        const items= await this.getItems(filesIDs);
        if(items.success==false) return items;

        return this.getFilesFromItems(items.data,cb);
    }

}