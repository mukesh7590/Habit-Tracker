const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      // console.log("dfsfsfs ",process.env.MONGO_URI)
      const conn = await mongoose.connect(process.env.MONGO_URI);

      console.log(`                                 MongoDB Connection Established      \n`);
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

module.exports = connectDB;
