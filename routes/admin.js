const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');

const rootDir = require('../utils/path');

// Importing mongoose schemas
const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');

const router = express.Router();

// variables
const products = [];

router.get('/issue/:issueId', asyncHandler(async (req, res, next) => {
    const issues = await Issue.find({ "_id": req.params.issueId });
    console.log(req.params.issueId)
    console.log(issues)
    console.log('Issue pbject length: ', issues.length)
    res.render('issue', { issues });
}));

router.get('/project/:projectId', asyncHandler(async (req, res, next) => {
    const project = await Project.findOne({ _id: req.params.projectId });
    const issues = await Issue.find({ "project": req.params.projectId });
    res.render('project-view', { issues, project_name: project.name, project_id: project._id  });
}));

router.get('/projects', (req, res, next) => {
    res.render('projects');
});

router.get('/projects/list', asyncHandler(async (req, res, next) => {
    const projects = await Project.find();
    console.log(projects)
    res.render('list-projects', { projects });
}));

router.get('/projects/add', (req, res, next) => {
    res.render('add-project');
});

router.get('/issue/:projectId/add', (req, res, next) => {
    res.render('add-issue', { project_id: req.params.projectId });
});

router.get('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;