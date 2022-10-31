const mongoose = require("mongoose");

// Schema for habit here

const userSchema = new mongoose.Schema(
   {
      userName: {
         type: String,
         unique: true,
         required: true,
      },
      
      habits: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Habit",
         },
      ],
   },
   {
      timestamp: true,
   }
);

// model creating here

const User = mongoose.model("User", userSchema);
module.exports = User;
