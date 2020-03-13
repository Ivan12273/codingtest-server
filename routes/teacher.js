'use strict'

var express = require('express');
var TeacherController = require('../controller/teacher');

var router = express.Router();

router.get('/test', TeacherController.test);

module.exports = router;