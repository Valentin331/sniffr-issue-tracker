const express = require('express');

const { addProject, getProjects } = require('../controllers/projects');

const router = express.Router();

router.route('/add').post(addProject);
router.route('/getall').get(getProjects);

module.exports = router;