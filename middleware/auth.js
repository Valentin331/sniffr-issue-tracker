const asyncHandler = require('./asyncHandler');

exports.authenticate = () =>  asyncHandler( async (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();    
});

exports.protect = asyncHandler( async (req, res, next) => {
    console.log('protect middleware called')
    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    } 
});


 