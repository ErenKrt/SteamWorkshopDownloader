import axios, { Axios } from "axios";
import { DownladerOptions, Downloaded,Result,Info, ChildInfo, DownloadCollection,DownloadType,DownloadProgress, DownloadStatus } from "./interfaces";
import * as path from "path"
import * as fs from "fs"

export class Downloader{
    private options:DownladerOptions;
    private client:Axios;

    private endPoints={
        status:"download/status",
        file:"details/file",
        download:"download/request",
        storage:"storage"
    }
    constructor(
        options:DownladerOptions = {
            apiVersion:"node02",
            userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/83.0.4254.62",
            apiPrefix:"prod/api"
        }
    ){
        this.options=options;

        this.client= axios.create({
            baseURL:`https://${this.options.apiVersion}.steamworkshopdownloader.io/${this.options.apiPrefix}/`,
            headers:{
                "User-Agent":this.options.userAgent
            }
        });
    }
    private sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async Info(WorkshopID:number[]) : Promise<Result<Info[]>> {
        let Donut:Result<Info[]>={
            success:false
        };
        var Request=null;

        try {
            Request= (await this.client.post(this.endPoints.file,`[${WorkshopID.toString()}]:`)).data;
        } catch (ex : any) {
            Donut.success=false;
            Donut.message= ex.message;
            return Donut;
        }

        if(Request.length <= 0){
            Donut.success=false;
            Donut.message= "Cant find item(s) with id(s)";
            return Donut;
        }

        var Data : Info[]=[];

        Request.forEach(async (SingleItem:any) => {

            var ItemInfo: Info= {
                id:Number(SingleItem.publishedfileid),
                title:SingleItem.title,
                safeTitle:SingleItem.title_disk_safe,
                appName:SingleItem.app_name,
                image:SingleItem.file_url,
                size:Number(SingleItem.file_size),
                uploadedDate:SingleItem.time_created,
                downloadType: SingleItem.download_format=="raw"?DownloadType.Raw:DownloadType.GmaExtract
            };

            if(SingleItem.children !=null && SingleItem.children.length > 0)
                ItemInfo.childs=SingleItem.children.map((x:any)=><ChildInfo>{ id:x.publishedfileid });

            Data.push(ItemInfo);
        });

        Donut.success=true;
        Donut.data=Data;
        return Donut;
    }
    async Download(WorkshopID:number[],DownPath:string) : Promise<Result<Downloaded[]>> {
        let Donut:Result<Downloaded[]>={
            success:false,
            data:[]
        };
        
        var Infos=(await this.Info(WorkshopID)).data;
        if(Infos==null){
            Donut.message="Cant fetch workshop(s) item(s).";
            return Donut;
        }

        var DownCollection: DownloadCollection[]=[];

        for await (const SingleInfo of Infos) {
            try {
                
                var Request= (await this.client.post(this.endPoints.download,{
                    publishedFileId:SingleInfo.id,
                    collectionId:null,
                    hidden:false,
                    downloadFormat:DownloadType[SingleInfo.downloadType].toLowerCase(),
                    autodownload:false
                })).data;

                if(Request?.uuid!=null)
                    DownCollection.push({item:SingleInfo,uuid:Request.uuid,progress:{progress:0,status:DownloadStatus.dequeued}});
                
            } catch (ex : any) {
                console.warn(ex.message);
            }
        }

        var GetStatusOfCollection= (await this.client.post(this.endPoints.status,{
            uuids:DownCollection.map(x=>x.uuid)
        })).data;

        DownCollection.forEach(SingleDown=> {
            var Statu= GetStatusOfCollection[SingleDown.uuid];
            if(Statu!=null)
                var StatuType : DownloadStatus = DownloadStatus.dequeued;

                switch(Statu.status){
                    case "prepared":
                        StatuType=DownloadStatus.prepared
                        break;

                    case "transmitted":
                        StatuType=DownloadStatus.transmitted
                        break;

                    default:
                        StatuType=DownloadStatus.dequeued
                        break;
                }

                SingleDown.progress= {progress:Number(Statu.progress),status:StatuType};
        });
    

        var WillBeDownloaded= DownCollection.filter(x=>x.progress!=null);
        
        while(WillBeDownloaded.filter(x=>x.progress?.status==DownloadStatus.prepared).length != WillBeDownloaded.length){

            let stats= (await this.client.post(this.endPoints.status,{
                uuids:WillBeDownloaded.map(x=>x.uuid)
            })).data;

            var StatusUIDS= Object.keys(stats);
            StatusUIDS.forEach((SingleID : any) => {
                var Bul= WillBeDownloaded.find(x=>x.uuid==SingleID);
                if(Bul!=null || Bul!=undefined){
                    var StatFromID=stats[SingleID];
                    Bul!.progress!.progress=StatFromID.progress;
                    if(StatFromID.status=="prepared"){
                        Bul!.path="https://"+StatFromID.storageNode+"/prod//storage/"+StatFromID.storagePath;
                        Bul!.progress!.status=DownloadStatus.prepared;
                    }else{
                        Bul!.progress!.status=DownloadStatus.transmitted;
                    }
                }
            });
            await this.sleep(1000);
        }

        if(fs.existsSync(path.resolve(DownPath))==false)
            fs.mkdirSync(path.resolve(DownPath));

        for await (const SingleDown of WillBeDownloaded) {
            
            var DownloadRes= (await axios({
                url:SingleDown.path+"?uuid="+SingleDown.uuid,
                method:'GET',
                responseType:'stream'
            })).data;

            var FileName=SingleDown.item.safeTitle!=''?SingleDown.item.safeTitle:SingleDown.item.appName;

            var DownloadedPath= path.join(path.resolve(DownPath),FileName+".zip")
            var DownloadedSize=0;
            var EndedDownload=false;

            const Writer= fs.createWriteStream(DownloadedPath);
            DownloadRes.pipe(Writer);

            DownloadRes.on("data",(chunk:any)=>{
                DownloadedSize+=chunk.length;
            })

            DownloadRes.on('end',function(){
                EndedDownload=true;
            })

            while(EndedDownload==false){
                console.log(DownloadedSize+" kb Downloaded | Downloading... | "+DownloadedPath);
                await this.sleep(1000);
            }

            Donut.data?.push({
                path:DownloadedPath,
                size:DownloadedSize
            });
        }

        
        Donut.success=true;
        return Donut;
    }
}