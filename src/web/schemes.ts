import { Scheme } from './types'

var schemes:Scheme[] = [
    {
        id:0,
        name:"delete",
        description:"Delete file or folder",
        params:[
            {
                name:"path"
            }
        ],
        execute: (params)=>{
            console.log(params);
            return true;
        }
    }
];


export default schemes