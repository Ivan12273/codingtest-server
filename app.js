'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar archivos rutas
var classroom_routes = require('./routes/classroom');
var teacher_routes = require('./routes/teacher');

// middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS

// rutas
app.use('/classroom', classroom_routes);
app.use('/teacher', teacher_routes);

// exportar
module.exports = app;