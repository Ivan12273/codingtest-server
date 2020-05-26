'use strict'

var express = require('express');
var ClassroomController = require('../controller/classroom');

var router = express.Router();

router.get('/get-all-results', ClassroomController.getAllResults);
router.get('/problem/:student/:organization/:assignment', ClassroomController.problem);
router.get('/calification/:organization/:assignment/:student/:problemAlias/:language/:executionTime', ClassroomController.calification);
router.post('/create-problem', ClassroomController.createProblem);

module.exports = router;