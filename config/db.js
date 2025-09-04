const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n\n\n\t\t\tMongoDb Connected on HOST: ${connectionInstance.connection.host}\n\n`
    );
  } catch (err) {
    console.error(`MongoDb not Connected: ${process.env.MONGO_URI}`, err);
    process.exit(1);
  }
};

module.exports = connectDB;

