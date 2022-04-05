import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import router from './router'
import chalk from 'chalk';

function startWeb(port: number){
    var app = express()

    app.use(express.static(path.join(__dirname, '/public')))
    app.use(morgan('dev'))
     
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
     
    app.listen(port || process.env.PORT || 8080 )
    app.use('/api', router)
     
    app.get('/', function (req, res, next) {
        if(process.env.NODE_ENV.trim() === "dev")
            res.redirect("http://localhost:3000/");
        else
            res.sendFile('./public/index.html')
    })
     
    console.log(chalk.green("Server is ready on ")+chalk.red(port));

    return {
        app
    }
}


export { startWeb };

