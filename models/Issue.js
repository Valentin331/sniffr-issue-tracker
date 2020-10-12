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
        default: "No description"
    },
    userinfo_dump: {
        type: String
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true
    },
    creation_type: {
        type: String,
        enum: ["api", "user"],
        required: [true, "Please add creation_type property"]
    },
    code_dump: {
        type: String
    }
});
 
module.exports = mongoose.model('Issue', IssueSchema);