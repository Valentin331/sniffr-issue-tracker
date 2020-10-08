const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

// Importing mongoose schemas
const Project = require('../models/Project.js');

// @desc Get all projects
// @route POST /api/project/get
// @access Public
exports.getProjects = asyncHandler( async (req, res, next) => {
    const projects = await Project.find();
    res.status(200).json({ success: true, data: projects });
});

// @desc Add project
// @route POST /api/project/add
// @access Public
exports.addProject = asyncHandler( async (req, res, next) => {
    console.log(req.body);
    // Check if item name exists
    const projectExists = await Project.findOne({ "name": req.body.name });
    console.log(projectExists)
    if (projectExists) {
       return next(new ErrorResponse(`Project with that name already exists!`, 400));
    }
    try {
        const project = await Project.create(req.body);
        console.log(project)
        res.redirect('/projects/list');
    } catch (error) {
        console.log(error)
    }
    
});