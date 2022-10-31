const mongoose = require("mongoose");

// Schema for habit here

const habitSchema = new mongoose.Schema(
   {
      habit_name: {
         type: String,
         required: true,
      },
      start: {
         type: Date,
         required: true,
      },
      end: {
         type: Date,
         required: true,
      },
      current_Streak: {
         type: Number,
         default: 0,
      },
      best_Streak: {
         type: Number,
         default: 0,
      },
      success_Days: {
         type: Number,
         default: 0,
      },
      totalDaysTillDate: {
         type: Number,
         default: 0,
      },
      completions: {
         type: Map,
      },
   },
   {
      timestamp: true,
   }
);

// model creating here
const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;
