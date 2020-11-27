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
```
Import
```js
const {Downloader} = require('steamworkshopdownloader');
```
<br>

## Examples
Ready to work !

```js
var DownClient= new Downloader();

(async function(){
    var Down= 
    await DownClient.Download("450814997",path.resolve("./folder/"),function(data){
        console.log(data); 
        //data returns the downloaded size,folder name and some public info
    });

    console.log(Down);
})()
```

<br>
<hr>

Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)