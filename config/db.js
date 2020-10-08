const mongoose = require('mongoose');

const connectDatabase = async () => {
   try {
    const connection = await mongoose.connect( process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
     });
     console.log(`Connected to MongoDB database: ${connection.connection.host}`);
   } catch (error) {
       console.log(error)
   }
}

module.exports = connectDatabase;