import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import router from './router'
import chalk from 'chalk';
import http from 'http';
import cors from 'cors';

import { Server }  from 'socket.io';

const app = express()
const server = http.createServer(app)
let socket= null;

function startSocket(){
    socket= new Server(server);
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

function startWeb(port: number){
    startSocket();
    startAPI()

    server.listen(port || process.env.PORT || 8080 );
    console.log(chalk.green("Server is ready on ")+chalk.red(port));
}


export { startWeb , app, server, socket };

