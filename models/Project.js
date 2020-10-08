const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
        required: false,
        default: 'No description'
    },
    owner: {
        type: String,
        required: [true, 'Please add project owner.'],
    },
    n_of_people: {
        type: Number,
        default: 1
    },
    tags: {
        type: [String],
        required: false
    }
 });

 
 module.exports = mongoose.model('Project', ProjectSchema);