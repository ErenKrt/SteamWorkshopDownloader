import path from "path";
import os from "os";
import { MainConfig, SavedScheme } from "./types";
import fs from "fs";

class Config {
    private defaultBaseConfig: MainConfig ={
        currentPath: process.cwd(),
        port: 3000
    };
    private defaultSavedSchemes: SavedScheme[]=[];

    private baseDirectoryPath: string;
    private baseConfigPath: string;
    private savedSchemesPath: string;

    baseConfig: MainConfig;
    savedSchemesConfig: SavedScheme[];

    constructor(){
        this.baseDirectoryPath= path.resolve(os.homedir(),".steamwd/")
        this.baseConfigPath=path.resolve(this.baseDirectoryPath,"main.json");
        this.savedSchemesPath= path.resolve(this.baseDirectoryPath,"savedSchemes.json");

        this.prepareFolders();
        this.baseConfig= this.readMainConfig();
        this.savedSchemesConfig= this.readSavedSchemesConfig();
    }
    prepareFolders(){
        if(!fs.existsSync(this.baseConfigPath)) fs.mkdirSync(this.baseDirectoryPath);
        if(!fs.existsSync(this.baseConfigPath)) this.writeFile(this.baseConfigPath,this.defaultBaseConfig);
        if(!fs.existsSync(this.savedSchemesPath)) this.writeFile(this.savedSchemesPath,this.defaultSavedSchemes);
    }

    readMainConfig() : MainConfig{
        try {
            return {...this.defaultBaseConfig, ...JSON.parse(fs.readFileSync(this.baseConfigPath,"utf-8"))};
        } catch (error) {
            return this.defaultBaseConfig;
        }
    }
    readSavedSchemesConfig(): SavedScheme[]{
        try {
            return JSON.parse(fs.readFileSync(this.savedSchemesPath,"utf-8"));
        } catch (error) {
            return this.defaultSavedSchemes;
        }
    }
    
    writeFile(filePath: string, config) : void {
        fs.writeFileSync(filePath,JSON.stringify(config));
    }

    updateMainConfig(config: MainConfig){
        this.writeFile(this.baseConfigPath,config);
        this.baseConfig= this.readMainConfig();
    }

    updateSavedSchemes(schemes: SavedScheme[]){
        this.writeFile(this.savedSchemesPath, schemes);
        this.savedSchemesConfig= this.readSavedSchemesConfig();
    }

}

export default new Config();