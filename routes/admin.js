const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');

// Auth middleware
const { authenticate, protect } = require('../middleware/auth');

const rootDir = require('../utils/path');

// Importing mongoose schemas
const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');

const router = express.Router();


//router.use(authenticate);

router.get('/register', (req, res, next) => {
    res.render('register', {
        message: '',
        messageClass: ''
    });
});

router.get('/login', (req, res, next) => {
    res.render('login', {
        message: '',
        messageClass: ''
    });
});

router.get('/issue/:issueId', protect, asyncHandler(async (req, res, next) => {
    const issues = await Issue.find({ "_id": req.params.issueId });
    console.log(req.params.issueId)
    console.log(issues)
    console.log('Issue pbject length: ', issues.length)
    res.render('issue', { issues, user: req.user });
}));

router.get('/project/:projectId', protect, asyncHandler(async (req, res, next) => {
    const project = await Project.findOne({ _id: req.params.projectId });
    const issues = await Issue.find({ "project": req.params.projectId });
    res.render('project-view', { issues, project_name: project.name, project_id: project._id, user: req.user  });
}));

router.get('/projects', protect, (req, res, next) => {
    res.render('projects', { user: req.user  });
});

router.get('/projects/list', protect, asyncHandler(async (req, res, next) => {
    console.log('get porject list called')
    const projects = await Project.find();
    console.log(projects)
    res.render('list-projects', { projects, user: req.user  });
}));

router.get('/projects/add', protect, (req, res, next) => {
    res.render('add-project', { user: req.user  });
});

router.get('/issue/:projectId/add', protect, (req, res, next) => {
    res.render('add-issue', { project_id: req.params.projectId, user: {}  });
});

router.get('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;