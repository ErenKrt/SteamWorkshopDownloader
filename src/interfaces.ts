export enum DownloadType{
    GmaExtract,
    Raw
}
export enum DownloadStatus{
    dequeued,
    prepared,
    transmitted
}

export interface Result<T>{
    success:boolean,
    data?:T | null,
    message?:string
}

export interface DownladerOptions{
    userAgent:string,
    apiVersion:string,
    apiPrefix:string 
}
export interface Info{
    id:number,
    size:number,
    image:string,
    appName:string,
    title:string,
    safeTitle:string,
    uploadedDate:string,
    childs?:ChildInfo[] | null,
    downloadType:DownloadType,
    fileType: number
}
export interface ChildInfo{
    id:number
}

export interface DownloadProgress{
    progress:number,
    status:DownloadStatus
}

export interface DownloadCollection{
    uuid:string,
    item:Info,
    progress?:DownloadProgress | null,
    path?:string | null
}

export interface Downloaded{
    path:string,
    size:number
}