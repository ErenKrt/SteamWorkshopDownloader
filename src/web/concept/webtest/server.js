var express = require('express')
var morgan = require('morgan')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var config = require('./config')
var router = require('./router')
 
// static dosyaların public klasöründen karşılanacağı belirtilir
app.use(express.static(path.join(__dirname, '/public')))
 
// Middleware katmanına morgan'ı enjekte ederek loglamayı etkinleştirdik
app.use(morgan('dev'))
 
// İstemci taleplerinden gelecek Body içeriklerini JSON formatından kolayca ele almak için 
// Middleware katmanına body-parser modülünü ekledik
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
 
var port = process.env.PORT || config.port || 8080 // port bilgisi belirlenir. config'de varsa 5003 yoksa 8080
 
app.listen(port)
app.use('/api', router) // /api adresine gelecek taleplerin router modülü tarafından karşılanacağı belirtilir.
 
app.get('/', function (req, res, next) {
    if(process.env.NODE_ENV.trim() === "dev")
        res.redirect("http://localhost:3000/");
    else
        res.sendFile('./public/index.html')
})
 
console.log('Sunucu hazır ve dinlemede '+ port);