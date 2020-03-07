const express = require('express');
//const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const db = require('./db'); 
var app = express();
var port = 3000;

    const path = __dirname + '/views';
    //app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/routes', routes);
    //app.use(express.static(__dirname + '/views'));

    app.listen(port, ()=>{
        console.log("Server listening on port - " + port);
    })
