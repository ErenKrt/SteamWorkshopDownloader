import path from "path";
import os from "os";
import { MainConfig } from "./types";
import fs from "fs";

export class Config {
    private defaultBaseConfig: MainConfig ={
        currentPath: process.cwd(),
        port: 3000
    };

    private baseDir: string;
    private baseConfig: string;

    mainConfig: MainConfig;

    constructor(){
        this.baseDir= path.resolve(os.homedir(),".steamwd/")
        this.baseConfig=path.resolve(this.baseDir,"main.json");
        this.mainConfig= this.readMainConfig();
    }

    readMainConfig() : MainConfig{
        let conf:MainConfig;

        if(fs.existsSync(this.baseDir)==false) fs.mkdirSync(this.baseDir);

        if(fs.existsSync(this.baseConfig)){
            try {
                conf= {...this.defaultBaseConfig, ...JSON.parse(fs.readFileSync(this.baseConfig,"utf-8"))};
            } catch (error) {
                conf= this.defaultBaseConfig;
            }
        }else{
            fs.writeFileSync(this.baseConfig,JSON.stringify(this.defaultBaseConfig));
            conf= this.defaultBaseConfig;
        }

        return conf;
    }
    
    writeMainConfig() : void {
        fs.writeFileSync(this.baseConfig,JSON.stringify(this.defaultBaseConfig));
    }
    
}