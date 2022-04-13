#!/usr/bin/env node

const chalk = require('chalk');
const { Client } = require('../dist/api');
const {startWeb} = require('../dist/web')
const { makeDownloadUrl } = require('../dist/api/utils');
const { Command } = require('commander');
const Downloader = require("nodejs-file-downloader")
const cliProgress = require("cli-progress");
const { getAllDepIDS, formatBytes } = require('./utils');
const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");
const _ = require('lodash');

let downWorkshopIDS = [];
let downPath= path.resolve(process.cwd());

let options={
    downloadDependencies:false,
    unzip:false,
    unzipDelete: false,
    downloadCount:20,
    isWeb: false
}

const program = new Command();

program
    .name('SteamWorkShopDownloader-CLI')
    .description('This CLI helps you for steam workshops download.')
    .version('3.0.0');

program.command('download', { isDefault: true })
    .description('Download workshop with ID')
    .argument('<numbers...>', 'Workshop IDS')
    .option('-c, --itemcount',"number of simultaneous downloads",20)
    .option('-d, --dependencies', "Download all depencies of workshops.", false)
    .option('-u, --unzip',"Unzip after download", false)
    .option('-ud, --unzipdel',"Delete after unzip", false)
    .action((workshopIDS, clioptions) => {
        downWorkshopIDS = workshopIDS;
        options.downloadCount= clioptions.itemcount;
        options.downloadDependencies= clioptions.dependencies;
        if(clioptions.unzipdel){
            options.unzip=true;
            options.unzipDelete=true;
        }else{
            options.unzip= clioptions.unzip;
        }
    });


program.command('web',{isDefault: false})
    .action((data,clioptions)=>{
        options.isWeb= true;
    });

program.parse();


if(options.isWeb){
    startWeb();
}else{

var MyClient = new Client();

var fetchedItems=[];

let showError = (message) => {
    console.log(chalk.red(message));
};

let getNameFromID= (ID)=>{
    return fetchedItems.find(x => x.publishedfileid == ID)?.title_disk_safe || ID;
};

let getItems= async (IDS) =>{
    let ResIDS=[];

    const getItems= await MyClient.getItems(IDS);
    if(getItems.success==false) return showError(getItems.message);
    

    for(const SingleItem of getItems.data){
        if(SingleItem.file_type!=2){
            ResIDS.push(SingleItem.publishedfileid);
            var GetItem = await MyClient.getItems(ResIDS);
            if (GetItem.success == false) return showError(GetItem.message);
            fetchedItems= fetchedItems.concat(GetItem.data);
        }

        if ((options.downloadDependencies || SingleItem.file_type == 2) && SingleItem.children != null && SingleItem.children.length > 0) {
            var lookIDS = SingleItem.children.map(x => x.publishedfileid);
            
            if(SingleItem.file_type==0) ResIDS.push(SingleItem.publishedfileid);
    
            var getDeps = await getAllDepIDS(MyClient,lookIDS);

            ResIDS= ResIDS.concat(getDeps.IDS);
            fetchedItems= getDeps.Items;
            ResIDS = ResIDS.filter((item, i, ar) => ar.indexOf(item) === i);
        }
    }
    
    return ResIDS;
};

let prepareItems= async (IDS)=>{
    console.log(chalk.green("Fetching data from ")+chalk.gray("STEAM"));

    let progressHolder=[];

    let multiBar = new cliProgress.MultiBar({
        clearOnComplete: true,
        stopOnComplete: true,
        hideCursor: true,
        format: '{bar} | {name} | {value}/{total}',
    }, cliProgress.Presets.shades_grey);

    (IDS).forEach(SingleID => {
        const progress = multiBar.create(100, 0, { name: getNameFromID(SingleID)});
        progressHolder.push({
            progress,
            publishedfileid: SingleID
        });
    });

    var downRequest = await MyClient.getFiles(IDS, (data) => {
        const find = progressHolder.find(x => x.publishedfileid == data.publishedfileid);
        if (find != null) find.progress.update(data.progress, { name: getNameFromID(data.publishedfileid)});
    });

    if (downRequest.success == false) return showError("Error on getFiles: " + downRequest.message);

    return downRequest.data;
};

let download = async (Items) => {
    console.log(chalk.green("Downloading item(s)"));

    let multiBar = new cliProgress.MultiBar({
        clearOnComplete: true,
        stopOnComplete: true,
        hideCursor: true,
        format: '{bar} | '+chalk.gray('{name}')+' | '+chalk.green('{value}')+' / {total} | '+chalk.green('{remainingSize}')+' / {totalSize}',
    }, cliProgress.Presets.shades_grey);


    let downloaded=[];

    let downs = [];

    (Items).forEach(x => {
        const progress = multiBar.create(100, 0, { name: getNameFromID(x.publishedfileid)});
        var down = new Downloader({
            url: makeDownloadUrl(x),
            directory: downPath,
            onProgress: function (percentage, chunk, remainingSize) {
                progress.update(parseInt(percentage),{remainingSize:formatBytes(remainingSize)});
            },
            onResponse: function (data){
                progress.update({remainingSize:formatBytes(data.headers['content-length']),totalSize:formatBytes(data.headers['content-length'])});
            },
            onBeforeSave: function(name){
                downloaded.push({fileName:name,publishedfileid:x.publishedfileid});
            }
        });

        downs.push(down.download());
    });

    await Promise.all(downs);

    console.clear();

    downloaded.forEach(SDownloaded => {
        var downloadedPath= path.join(downPath,SDownloaded.fileName);

        console.log(chalk.green(getNameFromID(SDownloaded.publishedfileid)) +" downloaded as "+chalk.green(SDownloaded.fileName));
        if(options.unzip){
            const zip= new AdmZip(downloadedPath);
            zip.extractAllTo(path.join(downPath,getNameFromID(SDownloaded.publishedfileid)),true);

            console.log(chalk.green(SDownloaded.fileName) +" unzipped as "+chalk.green(getNameFromID(SDownloaded.publishedfileid)));

            if(options.unzipDelete) fs.unlink(downloadedPath,(err)=>{});
        }
    });
    
   return downloaded;
};

getItems(downWorkshopIDS)
    .then(async IDS=>{
        console.log(chalk.green("Will be download item count: "+IDS.length));
        var workShopIDS= _.chunk(IDS,options.downloadCount);

        for await(const WIDS of workShopIDS){
            var Items= await prepareItems(WIDS);

            if(Items!=null) await download(Items);
        }
    }).catch(err=>showError(err));
  
}