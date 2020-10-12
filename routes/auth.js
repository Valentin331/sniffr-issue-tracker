const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');

// Mongoose schemas
const User = require('../models/User');
const AuthToken = require('../models/AuthToken');


// Helper functions

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}


router.post('/register', asyncHandler(async (req, res, next) => {
    console.log('reg post req reached')

    //         Code taken from https://stackabuse.com/handling-authentication-in-express-js/ 

    const { email, firstName, lastName, username, password, confirmPassword } = req.body;

    console.log(req.body)

    // Check if the password and confirm password fields match
    if (password === confirmPassword) {
        console.log('passs match')

        // Fetching the user with that email
        const emailUserExists = await User.findOne({ email: email });
        // Fetching the user with that username
        const usernameUserExists = await User.findOne({ username: username });

        console.log(emailUserExists)
        console.log(usernameUserExists)

        // if user exists, re-render the reg page with that message
        if (emailUserExists || usernameUserExists) {
            console.log('User already registered.')
            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = getHashedPassword(password);

        // Store user into the database

        const regUser = User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword,
            username: username
        });

        console.log('Registration Complete. Please login to continue.')

        res.render('login', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        console.log('error at reg');
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
}));

router.post('/login', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    // Finding user with that email
    const user = await User.findOne({ email: email, password: hashedPassword });

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication token
        const token = AuthToken.create({
            token: authToken,
            user: user._id
        });

        console.log('Login logic user data:', user)

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/projects/list');
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
}));

router.get('/logout', asyncHandler(async (req, res, next) => {
    console.log('AuthToken cookie cleared');
    res.clearCookie('AuthToken');
    res.redirect('/');
}));

module.exports = router;