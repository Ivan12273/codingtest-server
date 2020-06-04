'use strict'

var express = require('express');
var bodyParser = require('body-parser');
// var fileupload = require('express-fileupload');
var cors = require('cors')

var app = express();

// cargar archivos rutas
var classroom_routes = require('./routes/classroom');
var teacher_routes = require('./routes/teacher');

// middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors());
// app.use(fileupload());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas
app.use('/classroom', classroom_routes);
app.use('/teacher', teacher_routes);

// exportar
module.exports = app;