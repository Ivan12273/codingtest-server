'use strict'

var express = require('express');
var ClassroomController = require('../controller/classroom');

var router = express.Router();

router.get('/get-all-results', ClassroomController.getAllResults);
router.get('/validate-code', ClassroomController.validateCode);

module.exports = router;