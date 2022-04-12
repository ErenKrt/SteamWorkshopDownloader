import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import router from './router'
import chalk from 'chalk';
import http from 'http';
import cors from 'cors';

import { Config } from './config'
import { Server }  from 'socket.io';
import { Client } from '../api'
import { WebSocket } from './webSocket'

const config= new Config();

const wdClient = new Client();

const app = express()
const server = http.createServer(app)
let socket= null;


function startSocket(){
    var socket= new Server(server,{
        cors:{
            origin: "*"
        }
    });
    socket.on("connection",(sc)=>{
        console.log("Connected");

        sc.on("prepare",(args)=>{
            wdClient.getFiles(args,(statu)=>{
                sc.emit("preparing",
                    {
                        publishedfileid:statu.publishedfileid,
                        progress: statu.progress,
                        progressText: statu.progressText
                    }
                );
            }).then(x=>{
                sc.emit("prepared",x.data);
            });
        })

        sc.on('disconnect', function() {
            console.log('Got disconnect!');
         });
    });

}

function startAPI(){
    app.use(cors())
    app.use(express.static(path.join(__dirname, '/public')))
    app.use(morgan('dev'))
     
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
     
    app.use('/api', router)
     
    app.get('/', (req, res, next) => {
        if(process.env.NODE_ENV.trim() === "dev")
            res.redirect("http://localhost:3000/");
        else
            res.sendFile('./public/index.html')
    })
}

function startWeb(){
    var sckt= new WebSocket(server);
    //startSocket();
    startAPI()

    const port= config.mainConfig.port || process.env.PORT || 8080;
    server.listen(port);
    console.log(chalk.green("Server is ready on ")+chalk.red(port));
}


export { startWeb , app, server, socket, wdClient };

