const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all issues
// @route POST /api/project/get
// @access Public
exports.getIssues = asyncHandler( async (req, res, next) => {
    const issues = await Issue.find();
    res.status(200).json({ success: true, data: issues });
});