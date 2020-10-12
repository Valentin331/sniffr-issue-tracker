const path = require('path');
const express = require("express");
const connectDatabase = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Mongoose Schemas
const AuthToken = require('./models/AuthToken');
const User = require('./models/User');

// ============================ SETUP ============================

// Load enviroment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDatabase();

// Using express
const app = express();

// To parse cookies from the HTTP Request
app.use(cookieParser());

// Body parser => This is a middleware that extracts the entire body portion of an incoming request stream and exposes it to 'req.body'
app.use(bodyParser.urlencoded({ extended: false }));

// ========================= MIDDLEWARES ==========================

app.use(async (req, res, next) => {
  try {
    let userDocument = '';
    console.log('Auth middleware called.')
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];

  // Getting that auth token from database
  const userData = await AuthToken.findOne({ token: authToken });
  if (userData) {
    // Getting user info from database based on user id
    userDocument = await User.findById(userData.user);    
  }

  // Inject the user to the request
  req.user = userDocument;

  console.log('Current req.user:', req.user);

  next();
  } catch (error) {
    console.log(error)
  }
});

// Setting up EJS templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');


// Enable errorHandler
app.use(errorHandler);

// HTTP request logger => logs all http requests
if (process.env.NODE_ENV == "development") {
    console.log(`Development enviroment specified, using 'morgan' for logging to console.`);
    app.use(morgan("dev"));
}

// Static public file
app.use(express.static(path.join(__dirname, 'public')));


// ============================ ROUTES ============================

// Route files
const projects = require("./routes/projects");
const issues = require("./routes/issues");
const adminMain = require("./routes/admin");
const auth = require('./routes/auth');

// Mounting routers
// Views
app.use('/', adminMain)
// API
app.use("/api/project", projects);
app.use("/api/issue", issues);
app.use("/api/auth", auth);

// 404 page
app.use((req, res, next) => {
  res.status(404).render('404' /*{foo: 'FOO'}*/);
});

// ============================ PROCESS ============================

// Server status handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections => in case of server crash this logs the error
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Closes the server & exits the process
  server.close(() => process.exit(1));
});