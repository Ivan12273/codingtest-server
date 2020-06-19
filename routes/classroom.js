'use strict'

var express = require('express');
var ClassroomController = require('../controller/classroom');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var router = express.Router();

router.get('/problem/:student/:organization/:assignment', ClassroomController.problem);
router.get('/calification/:organization/:assignment/:student/:problemAlias/:language/:executionTime', ClassroomController.calification);

router.post('/create-problem', upload.single('problemContents'), ClassroomController.createProblem);

module.exports = router;