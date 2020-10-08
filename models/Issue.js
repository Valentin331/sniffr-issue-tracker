const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: [true, 'Please add project name']
    },
    description: {
        type: String,
        required: false
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true
    }
 });

 
 module.exports = mongoose.model('Issue', IssueSchema);