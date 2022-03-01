Download your Mods,Workshop items with SteamWorkshopDownloader on NodeJS.
Currently using steamworkshopdownloader.io backend. 
<div align="center">
    <a href="https://www.npmjs.com/package/steamworkshopdownloader">
        <img alt="Npm Page" src="https://img.shields.io/badge/steamworkshopdownloader-red?style=for-the-badge&logo=npm">
    </a>
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
> steamwd {WorkshopID}
- - - - - - - - - - - -
> steamwd 2712258971 274974446 274974442
```
<br>

## Import Using
```js
import {Downloader} from 'steamworkshopdownloader'

const MyClient= new Downloader();
```
<br>

### Examples
Get info of workshop from ID.
```js
(async function(){
    console.log(await MyClient.Info([274974446]));
})()
```

Download workshop from ID(s).
```js
(async function(){
    //[IDS],DownloadPath
    var Down= await MyDown.Download([2712258971],"./downs/");
    console.log(Down);
})()
```
<hr>

Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)