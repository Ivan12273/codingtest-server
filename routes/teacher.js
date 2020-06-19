'use strict'

// El controlador, el modelo y las rutas de teacher fueron creadas para conectarse a la base de datos de mongo DB, no se trabajaron mucho estas partes del código
var express = require('express');
var TeacherController = require('../controller/teacher');

var router = express.Router();

router.get('/test', TeacherController.test);

module.exports = router;