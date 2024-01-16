const { default: axios } = require("axios");

class API{
    constructor(){
        if(process.env.NODE_ENV==='development'){
            this.baseURL="http://127.0.0.1:3000/api",
            this.socketURL= "http://127.0.0.1:3000/";
        }else{
            this.baseURL="/api",
            this.socketURL= "/";
        }
        
        this.client= axios.create({
            baseURL: this.baseURL
        })
    }
    async request(method, url, data=null){
        try {
            const response= await this.client({
                method,
                url,
                data
            });

            return response.data;

        } catch (error) {
            return {
                success:false,
                data:null,
                message: error.message
            } 
        }
    }
    async getItem(itemID){
        return await this.request("POST","/getItem",{itemID});
    }
    async getSchemes(){
        return await this.request("GET","/getSchemes");
    }
    async getConfig(){
        return await this.request("GET","/getConfig");
    }
}

export default new API();