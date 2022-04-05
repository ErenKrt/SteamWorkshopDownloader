export interface Param{
    name: string;
    description?: string;
}

export interface Scheme {
    id: number;
    name: string;
    description: string; 
    params: Param[];
    
    execute: (params:string[]) => boolean | void 
}