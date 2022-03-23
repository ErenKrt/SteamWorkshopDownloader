import { ClientConfig } from "./types";

export const defaultConfig : ClientConfig={
    apiVersion:"node0"+(Math.floor(Math.random() * 5) + 1),
    apiPrefix:"prod/api",
    userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/83.0.4254.62"
}

export let endpoints={
    file:"details/file",
    status:"download/status",
    download:"download/request",
    storage:"storage"
};