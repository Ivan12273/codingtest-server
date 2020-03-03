'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar archivos rutas

// middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS

// rutas
app.get('/test', (req, res) => {
    res.status(200).send({
        message: "Prueba"
    });
});

// exportar
module.exports = app;