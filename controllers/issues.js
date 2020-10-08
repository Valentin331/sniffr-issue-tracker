const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

// Importing mongoose schemas
const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');


// @desc Get all issues
// @route POST /api/project/get
// @access Public
exports.getIssues = asyncHandler( async (req, res, next) => {
    const issues = await Issue.find();
    res.status(200).json({ success: true, data: issues });
});

// @desc Get all issues of a specific project
// @route POST /api/project/get
// @access Public
exports.getIssuesByProject = asyncHandler( async (req, res, next) => {
    //req.params.projectId

    

    const issues = await Issue.find({ "project": req.params.projectId });
    res.status(200).json({ success: true, data: issues });
});

// @desc Add issue
// @route POST /api/project/add
// @access Public
exports.addIssue = asyncHandler( async (req, res, next) => {

    // Destructuring the body
    const { name, desc} = req.body;

    // Check if item name exists
    const issueExists = await Issue.findOne({ "name": req.body.name });

    // Check if project exists
    const projectExists = await Project.findById(req.params.projectId);
    if (!projectExists) {
       return next(new ErrorResponse(`Project with that name doens't exist!`, 400));
    }
    console.log(projectExists)
    if (issueExists) {
       return next(new ErrorResponse(`Issue with that name already exists!`, 400));
    }

    const issue = await Issue.create({
        "name": name,
        "description": desc,
        "project": projectExists._id
    });
    console.log(issue)
    res.status(200).json({ success: true, data: issue });
    
});

// @desc Add issue
// @route POST /api/project/add
// @access Public
exports.addIssueView = asyncHandler( async (req, res, next) => {

    // Destructuring the body
    const { name, desc } = req.body;

    // Check if item name exists
    const issueExists = await Issue.findOne({ "name": req.body.name });

    // Check if project exists
    const projectExists = await Project.findById(req.params.projectId);
    if (!projectExists) {
       return next(new ErrorResponse(`Project with that name doens't exist!`, 400));
    }
    console.log(projectExists)
    if (issueExists) {
       return next(new ErrorResponse(`Issue with that name already exists!`, 400));
    }

    const issue = await Issue.create({
        "name": name,
        "description": desc,
        "project": req.params.projectId
    });
    console.log(issue)
    res.redirect(`/project/${req.params.projectId}`);
    
});