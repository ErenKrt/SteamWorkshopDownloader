Download your Mods,Workshop items with SteamWorkshopDownloader on NodeJS.
Currently using steamworkshopdownloader.io backend. 
<div align="center">
    <a href="https://www.npmjs.com/package/steamworkshopdownloader">
        <img alt="Npm Page" src="https://img.shields.io/badge/steamworkshopdownloader-red?style=for-the-badge&logo=npm">
        <img alt="Npm version" src="https://img.shields.io/npm/v/steamworkshopdownloader?style=for-the-badge">
    </a>
    <img src="https://img.shields.io/npm/l/steamworkshopdownloader?style=for-the-badge">
    <br>
    <a href="https://github.com/ErenKrt/Node-SteamWorkshopDownloader/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/ErenKrt/Node-SteamWorkshopDownloader?style=for-the-badge">
    </a>
    <a href="https://github.com/ErenKrt/Node-SteamWorkshopDownloader/stargazers">
        <img alt="GitHub stars" src="https://img.shields.io/github/stars/ErenKrt/Node-SteamWorkshopDownloader?style=for-the-badge">
    </a>
</div>
<div align="center">
  <sub>Built with ❤︎ by
  <a href="https://instagram.com/ep.eren/">EpEren</a>
</div>
<hr>
<div align="center">
  <h4>
  |
    <a href="#usage">
      Usage
    </a>
    •
     <a href="#examples">
      Examples
    </a>
    |
  </h4>
</div>

## Usage
With [npm](https://npmjs.org/) installed, run
<br>
```sh
> npm install steamworkshopdownloader
- OR - 
> npm install steamworkshopdownloader -g
```
## Global Using
You can download specific folder with global using.
```js
> cd ./YourFolder
>
> steamwd --help
>
> - - - - - - - - - - -
> -d = Download dependencies.
> -u = Unzip item
> -ud = Unzip and delete zip
> - - - - - - - - - - -
>
> - - - - - - - - - - -
> steamwd [WorkshopIDS]
> - - - - - - - - - - -
> steamwd 2712258971 274974446 274974442
> - - - - - - - - - - -
> steamwd 2712258971 -d -u
> - - - - - - - - - - -
> steamwd download 2712258971 -ud
> - - - - - - - - - - -
```
<br>

## Import Using
```js
import { Client } from 'steamworkshopdownloader'

const MyClient= new Client();
```
<br>

### Examples
Get info of workshop from ID.
```js
(async function(){
    console.log(await MyClient.getItems([274974446]));
})()
```

Get workshop files from item(s).
```js
(async function(){
    var items= await MyClient.getItems([2712258971]);

    var res= await MyClient.getFilesFromItems(items.data,(Statu)=>{
        console.log(items.data.find(x=>x.publishedfileid==Statu.publishedfileid).title_disk_safe+" => %"+Statu.progress+" | "+Statu.status);
    });

    console.log(res);
})()
```

Get workshop files from ID(s).
```js
(async function(){
    var res= await MyClient.getFiles([2712258971],(Statu)=>{
        console.log(Statu.publishedfileid+" => %"+Statu.progress+" | "+Statu.status);
    });

    console.log(res);
})()
```
<hr>

Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)