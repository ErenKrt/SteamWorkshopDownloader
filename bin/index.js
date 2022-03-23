const chalk = require('chalk');
const { Client } = require('../dist/api');
const { makeDownloadUrl } = require('../dist/api/utils');
const { Command } = require('commander');
const Downloader = require("nodejs-file-downloader")
const cliProgress = require("cli-progress");
const { getAllDepIDS, formatBytes } = require('./utils');
const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");

let downWorkshopIDS = [];
let isdownloadDependencies = false;
let downPath= path.resolve(process.cwd());
let isUnzip=false;
let isUnzipDel= false;

const program = new Command();

program
    .name('SteamWorkShopDownloader-CLI')
    .description('This CLI helps you for steam workshops download.')
    .version('3.0.0');

program.command('download', { isDefault: true })
    .description('Download workshop with ID')
    .argument('<numbers...>', 'Workshop IDS')
    .option('-d, --dependencies', "Download all depencies of workshops.", false)
    .option('-u, --unzip',"Unzip after download", false)
    .option('-ud, --unzipdel',"Delete after unzip", false)
    .action((workshopIDS, options) => {
        isdownloadDependencies = options.dependencies;
        isUnzip= options.unzip;
        downWorkshopIDS = workshopIDS;

        if(options.unzipdel){
            isUnzip= true;
            isUnzipDel=true;
        }
    });

program.parse();



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

    for (const SingleItem of getItems.data){
        if(SingleItem.file_type!=2){
            ResIDS.push(SingleItem.publishedfileid);
            var GetItem = await MyClient.getItems(ResIDS);
            if (GetItem.success == false) return showError(GetItem.message);
            fetchedItems= fetchedItems.concat(GetItem.data);
        }

        if ((isdownloadDependencies || SingleItem.file_type == 2) && SingleItem.children != null && SingleItem.children.length > 0) {
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
        if(isUnzip){
            const zip= new AdmZip(downloadedPath);
            zip.extractAllTo(path.join(downPath,getNameFromID(SDownloaded.publishedfileid)),true);

            console.log(chalk.green(SDownloaded.fileName) +" unzipped as "+chalk.green(getNameFromID(SDownloaded.publishedfileid)));

            if(isUnzipDel) fs.unlink(downloadedPath,(err)=>{});
        }
    });
    
   return downloaded;
};

getItems(downWorkshopIDS)
    .then(IDS=>{
        prepareItems(IDS)
            .then(Items=>{
                download(Items)
            })
    }).catch(err=>showError(err));