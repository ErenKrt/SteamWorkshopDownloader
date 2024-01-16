import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import router from './router'
import chalk from 'chalk';
import http from 'http';
import cors from 'cors';

import config from './config'
import { Server }  from 'socket.io';
import { Client } from '../api'
import { WebSocket } from './webSocket'

const wdClient = new Client({
    apiVersion:"node02"
});

const app = express()
const server = http.createServer(app)


function startAPI(){
    app.use(cors())
    app.use(express.static(path.join(__dirname, '/public')))
    app.use(morgan('dev'))
     
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
     
    app.use('/api', router)
     
    app.get('/', (req, res, next) => {
        if(process.env.NODE_ENV === "dev")
            res.redirect("http://localhost:3000/");
        else
            res.sendFile(path.join(__dirname, '/public/index.html'))
    })
}

function startWeb(){
    config.baseConfig.currentPath= process.cwd();
    config.updateMainConfig(config.baseConfig);

    var socket= new WebSocket(server);
    
    startAPI()

    const port= config.baseConfig.port || process.env.PORT || 8080;
    server.listen(port);
    console.log(chalk.green("Server is ready on ")+chalk.red(port));
}


export { startWeb , wdClient };

