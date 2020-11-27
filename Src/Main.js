const { default: Axios } = require("axios");
const path= require("path");
const fs= require('fs');
const Uri= Object.freeze({
    FileDetails:"details/file",
    DownloadStatu:"download/status",
    DownloadReq:"download/request",
    Download:"download/transmit?uuid="
})
const ResponseTypes= Object.freeze({
    success:0,
    error:1,
    info:2,
    warning:3
});
class Downloader{
    /**
     * Creates an instance of Downloader.
     * @param {string} [UserAgent]
     * @param {string} [Api]
     * @memberof Downloader
     */
    constructor(UserAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36 OPR/72.0.3815.320",Api="01"){
        /**
         * @private
         */
        this._UserAgent=UserAgent;
         /**
         * @private
         */
        this._BaseUrl="https://api_"+Api+".steamworkshopdownloader.io/api/";
        Axios.defaults.headers["User-Agent"]=this._UserAgent
    }
    /**
     * @private
     * @param {function} Cb 
     * @param {*} Data 
     */
    SendCbData(Cb,Data){
        if(Cb!=undefined && Cb!=null && typeof Cb=="function") Cb(Data);
    }
    /**
     * Get Workshop Item(s) info.
     * @param {Number[]} SteamIDS
     * @memberof Downloader
     */
    async GetInfo(SteamIDS){
        if(SteamIDS==undefined || typeof SteamIDS!="object" || SteamIDS.length<=0){
            throw new Error("Please check your SteamIDS varible");
        }
        var Ids= JSON.stringify(SteamIDS);
       
        var {data} = await Axios({
            url:this._BaseUrl+Uri.FileDetails,
            method:"POST",
            data:Ids
        });

        return data;
    }
    /**
     * Get Workshop Item(s) info.
     * @private
     * @param {string[]} DownloadUids
     * @memberof Downloader
     */
    async GetStatu(DownloadUids){
        if(DownloadUids==undefined || typeof DownloadUids!="object" || DownloadUids.length<=0){
            throw new Error("Please check your DownloadUids varible");
        }
        
        var {data} = await Axios({
            url:this._BaseUrl+Uri.DownloadStatu,
            method:"POST",
            data:{"uuids":DownloadUids}
        });

        return data;
    }
    /**
     * Get Workshop Item(s) info.
     * @param {string} WorkshopId
     * @param {string} [Path]
     * @param {function} [Cb]
     * @memberof Downloader
     */
    async Download(WorkshopId,Path=path.resolve(__dirname),Cb=null){
        if(WorkshopId==undefined || typeof WorkshopId!="string"){
            throw new Error("Please check your WorkshopId varible");
        }
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        var {data:DownloadReqRes} = await Axios({
            url:this._BaseUrl+Uri.DownloadReq,
            method:"POST",
            data:{"publishedFileId":Number(WorkshopId),"collectionId":null,"extract":true,"hidden":false,"direct":false,"autodownload":false}
        });
        

        if(DownloadReqRes!=null && DownloadReqRes!=undefined && DownloadReqRes!=""){
           
            var UUID=DownloadReqRes.uuid;
            this.SendCbData(Cb,{type:ResponseTypes.info,data:{type:"created",id:UUID}})
            var Stat= (await this.GetStatu([UUID]))[UUID];

            var Vm=this;

            while(Stat.status!="prepared"){
                if(Stat.status=="expired"){
                    throw new Error("Time expired please restart.");
                }
                setTimeout(async function() {
                    Stat= await Vm.GetStatu([UUID])[UUID];
                    this.SendCbData({type:ResponseTypes.info,data:{type:Stat.status,id:UUID,text:Stat.progressText}})
                },1000);
            }

            var {data:DownloadRes,headers:DownloadHeaders}= await Axios({
                url:this._BaseUrl+Uri.Download+UUID,
                method:'GET',
                responseType:'stream'
            });

            var FileName= DownloadHeaders["content-disposition"].split("filename=")[1];

            this.SendCbData(Cb,{type:ResponseTypes.info,data:{type:"downloading",id:UUID,filename:FileName,size:0}});
            
            var DownloadedPath= path.resolve(Path+"/"+FileName);
            var DownloadedSize=0;
            var EndedDownload=false;

            const Writer= fs.createWriteStream(DownloadedPath);
            if(Cb!=null){
                DownloadRes.on("data",function(chunk){
                    DownloadedSize+=chunk.length;
                    Vm.SendCbData(Cb,{type:ResponseTypes.info,data:{type:"downloading",id:UUID,filename:FileName,size:DownloadedSize}})
                })
            }
            DownloadRes.pipe(Writer);

            DownloadRes.on('end',function(){
                EndedDownload=true;
            })

            return new Promise(function(resolve,reject){
                var Int= setInterval(() => {
                    if(EndedDownload){
                        clearInterval(Int);
                        resolve({type:ResponseTypes.success,data:{type:"downloaded",id:UUID,filename:FileName,size:DownloadedSize,path:DownloadedPath}})
                    }
                }, 500);
            })


        }else{
            throw new Error("Error with request");
        }
       

    }

}

module.exports ={Downloader};