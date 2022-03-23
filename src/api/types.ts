export interface ClientConfig{
    userAgent?:string,
    apiVersion?:string,
    apiPrefix?:string 
}

export interface Result<T>{
    success:boolean,
    data?:T | null,
    message?:string
}

export interface ItemTag {
    tag: string;
    adminonly: boolean;
}

export interface ItemVoteData {
    result: number;
    votes_up: number;
    votes_down: number;
}

export interface Item {
  result: number;
  publishedfileid: number;
  creator: string;
  creator_appid: number;
  consumer_appid: number;
  consumer_shortcutid: number;
  filename: string;
  file_size: string;
  preview_file_size: string;
  file_url: string;
  preview_url: string;
  url: string;
  hcontent_file: string;
  hcontent_preview: string;
  title: string;
  title_disk_safe: string;
  file_description: string;
  time_created: number;
  time_updated: number;
  visibility: number;
  flags: number;
  workshop_file: boolean;
  workshop_accepted: boolean;
  show_subscribe_all: boolean;
  num_comments_developer: number;
  num_comments_public: number;
  banned: boolean;
  ban_reason: string;
  banner: string;
  can_be_deleted: boolean;
  incompatible: boolean;
  app_name: string;
  file_type: number;
  can_subscribe: boolean;
  subscriptions: number;
  favorited: number;
  followers: number;
  lifetime_subscriptions: number;
  lifetime_favorited: number;
  lifetime_followers: number;
  lifetime_playtime: string;
  lifetime_playtime_sessions: string;
  views: number;
  spoiler_tag: boolean;
  num_children: number;
  children?: any;
  num_reports: number;
  previews?: any;
  tags: ItemTag[];
  vote_data: ItemVoteData;
  language: number;
  download_format: string;
}


export type GetFileCallback= (Status : FileStatus) => void 

export interface GetFileUUID{
    publishedfileid: number,
    uuid: string
}

export interface FileStatus{
    publishedfileid: number,
    uuid: string,
    age: number;
    status: string,
    progress: number,
    progressText: string,
    bytes_size: number,
    bytes_transmitted: number,
    storageNode: string,
    storagePath: string
}