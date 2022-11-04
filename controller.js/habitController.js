const Habit = require("../models/habit");
const User = require("../models/user");
const moment = require("moment");
const asyncHandler = require("express-async-handler");

// home Action fetching the GUEST user and rendering the habit lists.
const home = asyncHandler(async (req, res) => {
   const user = await User.findOne({ userName: "Guest" }).populate("habits");
   return res.render("home", { habitList: user.habits });
});

// create the Habit
const add = asyncHandler(async (req, res) => {
   // creating the habit
   const habit = await Habit.create({
      habit_name: req.body.habit_name,
      start: req.body.start,
      end: req.body.end,
   });

   //getting all the days
   var start = moment(habit.start, "DD/MM/YYYY");
   var end = moment(habit.end, "DD/MM/YYYY");
   var today = moment(new Date(), "DD/MM/YYYY");

   // total days from today to start
   let totalDaysTillDate = today.diff(start, "days") + 2;

   //total days between Starting and Ending date
   let totalDays = end.diff(start, "days");

   // filled the MAP with NONE
   let completionsMap = new Map();
   for (let d = 0; d <= totalDays; d++) {
      var new_date = moment(habit.start, "DD/MM/YYYY");
      let date = new_date.add(d, "days").format("DD/MM/YYYY");
      completionsMap.set(date, "None");
   }

   // updating the MAP in Habit DB
   await Habit.updateOne(
      { _id: habit._id },
      {
         $set: {
            completions: completionsMap,
            totalDaysTillDate: totalDaysTillDate,
         },
      }
   );

   // finding the user and pushing the Update MAP into the habit attribute of User DB.
   const user = await User.findOne({ userName: "Guest" });
   user.habits.push(habit);
   user.save();

   return res.redirect("back");
});

// showing the habit
const showHabit = asyncHandler(async (req, res) => {
   // find the habit by the ID.
   const habit = await Habit.findById(req.params.id);
   let date = new Date();
   // array list that stored last 7 days actions records
   let arr = [];

   let tempStr = habit.start.toString().split(" ").slice(0, 4);

   let startDate =
      tempStr[0] + " " + tempStr[1] + " " + tempStr[2] + " " + tempStr[3];
   // loop for only last 7 days from today
   for (let d = 6; d >= 0; d--) {
      const previous = new Date(date.getTime());
      previous.setDate(date.getDate() - d);
      let dateStr = previous.toString().split(" ");

      // making the previous date
      let tempDate =
         dateStr[0] + " " + dateStr[1] + " " + dateStr[2] + " " + dateStr[3];

      // compairing the habit start date with previous date
      if (habit.start < previous || startDate == tempDate) {
         // fetch the date and actions from the completions MAP
         let action = habit.completions.get(
            moment(tempDate).format("DD/MM/YYYY").toString()
         );
         // push into the array
         arr.push({ date: tempDate, action: action });
      }
   }

   // redering the Habit and its last 7 days status
   return res.render("habit", {
      habit: habit,
      lastDays: arr,
      starting: startDate,
   });
});

// Habit action status
const takeAction = asyncHandler(async (req, res) => {
   // finding the habit by ID
   const habit = await Habit.findById(req.params.id);

   let date = moment()
      .subtract(req.body.dayBefore, "days")
      .format("DD/MM/YYYY");

   //temprary store the habit completions MAP
   const completionsMap = habit.completions;

   // toggling the staus here
   switch (completionsMap.get(date)) {
      case "Done":
         completionsMap.set(date, "Not-Done");
         break;
      case "Not-Done":
         completionsMap.set(date, "None");
         break;
      case "None":
         completionsMap.set(date, "Done");
         break;
   }

   // calculate the records
   let bestScore = 0,
      currentScore = 0,
      success = 0,
      totalDays = 0;

   // logic for getting records
   for (d of completionsMap) {
      totalDays++;
      if (d[0] == moment().format("DD/MM/YYYY").toString()) {
         if (d[1] == "Done") {
            if (++currentScore > bestScore) {
               bestScore = currentScore;
            }
            success++;
         }
         if (d[1] == "Not-Done") {
            currentScore = 0;
         }
         break;
      } else {
         if (d[1] == "Done") {
            if (++currentScore > bestScore) {
               bestScore = currentScore;
            }
            success++;
         } else {
            currentScore = 0;
         }
      }
   }

   await Habit.updateOne(
      { _id: req.params.id },
      {
         $set: {
            current_Streak: currentScore,
            best_Streak: bestScore,
            success_Days: success,
            totalDaysTillDate: totalDays,
            completions: completionsMap,
         },
      }
   );

   return res.redirect("back");
});

// Habit delete action
const habitDelete = asyncHandler(async (req, res) => {
   // find the habit and remove it
   let habit = await Habit.findById(req.params.id);
   habit.remove();

   // finding the user
   const user = await User.findOne({ userName: "Guest" });

   // pull the habit_ID from habit attribute of User model
   let post = await User.findByIdAndUpdate(user._id, {
      $pull: { habits: req.params.id },
   });

   return res.redirect("back");
});

module.exports = { home, add, showHabit, takeAction, habitDelete };
