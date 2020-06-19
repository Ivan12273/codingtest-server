'use strict'

// El controlador, el modelo y las rutas de teacher fueron creadas para conectarse a la base de datos de mongo DB, no se trabajaron mucho estas partes del código
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeacherSchema = Schema({
    name: String,
    classroom: String
});

module.exports = mongoose.model('Teacher', TeacherSchema);