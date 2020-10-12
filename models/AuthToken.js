const mongoose = require('mongoose');

const AuthTokenSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

 
module.exports = mongoose.model('AuthToken', AuthTokenSchema);