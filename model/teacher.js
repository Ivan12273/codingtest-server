'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeacherSchema = Schema({
    name: String,
    classroom: String
});

module.exports = mongoose.model('Teacher', TeacherSchema);