const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const dotenv = require("dotenv");

// Load enviroment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDatabase();

// Importing mongoose schemas
const Project = require('./models/Project.js');
const Issue = require('./models/Issue.js');
 
// replace the value below with the Telegram token you receive from @BotFather
const token = '1370637327:AAHHQu3ZyzQp4wtMBLPsYJAlBqs2C5hE8yE';
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// --------------------- Helper functions ---------------------
function removeBorderSpaces () { // function that removes the space chars from the begging and end of the string
  // placeholder
}

bot.onText(/\/create (.+)/, async (msg, match) => {


  const chatId = msg.chat.id;
  const capture = match[1]; // the captured string after the "/" command
 
  // parsing and validation
  console.log(`Input string: "${capture}"`);
  let splitted = capture.split("\"");

  // Checking first index of array (type of mongo document)
  let type = splitted[0].substring(0, splitted[0].length-1); // Removing last char which should be a space char (" ")


  // ===> TODO: This needs to get rewritten => issue and project types cant have the same validation algorithm <===

  /*if (!( splitted[2] === " " && splitted[4] === "" )) { // if input is correct, shoudn't equal true
    bot.sendMessage(chatId, "Your input is not valid! Please check your command.");
  }*/


  // Checking the type, entering logic based on which type
  if (type === "project") {

    try {
      const projectCreate = await Project.create({
        "name": splitted[1],
        "description": splitted[3]
      });
    } catch (error) {
      bot.sendMessage(chatId, `ERROR: Unable to create project. (projectCreate caught an error)\n \n ${error.toString()}`);
      return true;
    }

  } else if (type === "issue") {

    

      // Fetching the project, checking if exists and then getting the ObjectId for issue creation
      const getProject = await Project.findOne({ "name": splitted[1] });
      console.log(getProject)

      if (!getProject) {
        bot.sendMessage(chatId, `ERROR: Project with that name doesn't exist.`);
        return true;
      } else {

        try {
          // ---- Creating the issue ----
    
          const issueCreate = await Issue.create({
            "project": getProject._id,
            "name": splitted[3],
            "description": splitted[5]
          });
          console.log(issueCreate)
        } catch (error) {
          bot.sendMessage(chatId, `ERROR: Unable to create issue. (issueCreate caught an error)\n \n ${error.toString()}`);
          return true;
        }

      }

  } else {
    bot.sendMessage(chatId, `Your input is not valid! Please check your type! (Must be "project" or "issue").`);
  }


  if (capture == 'issues') {
    const issues = await Issue.find();
    console.log(issues)
    if (issues.length == 0) {
      bot.sendMessage(chatId, "I found no issues.");
    } else {
      bot.sendMessage(chatId, issues.toString());
    }
  }

});

bot.onText(/\/fetch (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const capture = match[1]; // the captured "whatever"

  // TODO: parsing the input on two parts and checking
 
  if (capture == 'project-all') {
    const projects = await Project.find();
    if (projects.length == 0) {
      bot.sendMessage(chatId, "I found no projects.");
    } else {
      bot.sendMessage(chatId, projects.toString());
    }
    
  } else if (capture == 'issue-all') {
    const issues = await Issue.find();
    console.log(issues)
    if (issues.length == 0) {
      bot.sendMessage(chatId, "I found no issues.");
    } else {
      bot.sendMessage(chatId, issues.toString());
    }
  } else {

    // If code gets here it means the input string has to have another parameter, so we parse it
    // parsing and validation
    console.log(`Input string: "${capture}"`);
    let splitted = capture.split("\"");

    // ===> TODO: This needs to get rewritten => issue and project types cant have the same validation algorithm <===

    /*if (!( splitted[0] === "" && splitted[2] === "" )) { // if input is correct, shoudn't equal true
      bot.sendMessage(chatId, "Your input is not valid! Please check your command.");
    }*/

    // Checking first index of array (type)
    let type = splitted[0].substring(0, splitted[0].length-1); // Removing last char which should be a space char (" ")

    if (type === "project-single-data") {

      const getProjectSingle = await Project.findOne({ "name": splitted[1] });
      console.log(getProjectSingle)


      if (!getProjectSingle) {
        bot.sendMessage(chatId, `ERROR: Project with that name doesn't exist.`);
        return true;
      } else {
        bot.sendMessage(chatId, getProjectSingle.toString());
      }

    } else if (type === "project-single-issues") {

      const getProjectValue = await Project.findOne({ "name": splitted[1] });
      console.log(getProjectValue)


      if (!getProjectValue) {
        bot.sendMessage(chatId, `ERROR: Project with that name doesn't exist.`);
        return true;
      } else {
        // Project found, fetching issues based on that project and then sending them to the user
        const getIssuesBasedonProject = await Issue.find({ "project": getProjectValue._id });
        console.log(getIssuesBasedonProject)

        if (!getIssuesBasedonProject) {
          bot.sendMessage(chatId, `ERROR: This project has no issues.`);
          return true;
        } else {
          bot.sendMessage(chatId, getIssuesBasedonProject.toString());
        }

      }

    } else if (type === "issue-single-data") {

      const getIssueSingle = await Issue.findOne({ "name": splitted[1] });
      console.log(getIssueSingle)


      if (!getIssueSingle) {
        bot.sendMessage(chatId, `ERROR: Issue with that name doesn't exist.`);
        return true;
      } else {
        bot.sendMessage(chatId, getIssueSingle.toString());
      }

    }
  }
});


// Listen for any kind of message. There are different kinds of
// messages.

/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;
 
  if (msg.text == "Zlatni konci litnje zore...") {
    bot.sendMessage(chatId, 'Dosli su u njenee dvoreeee❤');
  }

  if (msg.text == "Ki je tinetov IQ?") {
    bot.sendMessage(chatId, 'HAHAHAHHAHAHAHAHAHAHAH');
  }

  // send a message to the chat acknowledging receipt of their message
  
});*/