const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');

router.post('/courses', defaultController.createDefaultCourses);

module.exports = router;