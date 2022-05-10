import { Socket } from "socket.io";
import { Item } from "../api/types";
import { wsFolderPreview } from "./wsFolderPreivew";

export interface FileInfo{
    path?: string;
    canAccess?: boolean;
}

export interface Param{
    name: string;
    description?: string;
    value?: string;
}

export interface SchemeSave{
    id: number;
    params: Param[];
}

export interface SavedScheme{
    name: string;
    items: SchemeSave[];
}

export interface Scheme {
    id: number;
    name: string;
    description: string; 
    params: Param[];
    acceptChilds: boolean;
    execute: (params:string[]) => boolean | void 
}

export interface GetPathsRequest{
    path: string
}

export interface GetItemRequest{
    itemID: number
}

export interface MainConfig{
    currentPath: string;
    currentScheme?: number;
    port: number;
}

export interface Session{
    socket: Socket,
    items: Item[],
    previewFolder?: wsFolderPreview
}