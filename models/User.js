const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    first_name: {
        type: String,
        required: [true, "Please provide first name"]
    },
    last_name: {
        type: String,
        required: [true, "Please provide last name"]
    },
    username: {
        type: String,
        required: [true, "Please provide username"]
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    }
});

 
module.exports = mongoose.model('User', UserSchema);