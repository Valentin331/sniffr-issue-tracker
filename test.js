// Importing mongoose schemas
const Project = require('./models/Project.js');

function scaryClown() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('🤡');
      }, 2000);
    });
  }

const testFu = async () => {
      console.log('ran')
      const msg = await scaryClown();
      //const projects = await Project.find();
      //console.log(projects)
    console.log('msg') 
  }
  testFu();