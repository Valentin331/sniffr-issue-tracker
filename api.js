const path = require('path');
const express = require("express");
const connectDatabase = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const bodyParser = require('body-parser');

// ============================ SETUP ============================

// Load enviroment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDatabase();

// Using express
const app = express();

// Setting up EJS templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Body parser => This is a middleware that extracts the entire body portion of an incoming request stream and exposes it to 'req.body'
app.use(bodyParser.urlencoded({ extended: false }));

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

// Mounting routers
// Views
app.use('/', adminMain)
// API
app.use("/api/project", projects);
app.use("/api/issue", issues);

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