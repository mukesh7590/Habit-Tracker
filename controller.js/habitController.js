const Habit = require("../models/habit");
const User = require("../models/user");
const moment = require("moment");
const asyncHandler = require("express-async-handler");

function recordsCalculate(completionsMap) {
   let bestScore = 0,
      currentScore = 0,
      success = 0,
      totalDays = 0;

   for (d of completionsMap) {
      totalDays += 1;
      if (d[1] == "Done") {
         currentScore += 1;
         if (currentScore > bestScore) {
            bestScore = currentScore;
         }
         success += 1;
      } else {
         if (d[0] == moment().format("DD/MM/YYYY").toString()) {
            break;
         } else {
            currentScore = 0;
         }
      }
   }
   return {
      bestScore,
      currentScore,
      success,
      totalDays,
   };
}

const home = asyncHandler(async (req, res) => {
   const user = await User.findOne({ userName: "Guest" }).populate("habits");

   // console.log("data => ", user);
   return res.render("home", { habitList: user.habits });
});

const add = asyncHandler(async (req, res) => {
   const habit = await Habit.create({
      habit_name: req.body.habit_name,
      start: req.body.start,
      end: req.body.end,
   });

   var start = moment(habit.start, "DD/MM/YYYY");
   var end = moment(habit.end, "DD/MM/YYYY");
   var today = moment(new Date(), "DD/MM/YYYY");

   console.log(today, start, end);

   let totalDaysTillDate = today.diff(start, "days");
   console.log("totalDaysTillDate => ", totalDaysTillDate);

   //Difference in number of days
   let totalDays = end.diff(start, "days");

   let completionsMap = new Map();
   for (let d = 0; d <= totalDays; d++) {
      var new_date = moment(habit.start, "DD/MM/YYYY");
      let date = new_date.add(d, "days").format("DD/MM/YYYY");
      completionsMap.set(date, "None");
   }

   await Habit.updateOne(
      { _id: habit._id },
      {
         $set: {
            completions: completionsMap,
            totalDaysTillDate: totalDaysTillDate,
         },
      }
   );
   const user = await User.findOne({ userName: "Guest" });
   user.habits.push(habit);
   user.save();

   return res.redirect("back");
});

const showHabit = asyncHandler(async (req, res) => {
   const habit = await Habit.findById(req.params.id);
   let date = new Date();
   let arr = [];
   for (let d = 6; d >= 0; d--) {
      let st = moment(habit.start).format("DD/MM/YYYY");
      const previous = new Date(date.getTime());
      previous.setDate(date.getDate() - d);
      let dateStr = previous.toString().split(" ");
      let tempDate =
         dateStr[0] + " " + dateStr[1] + " " + dateStr[2] + " " + dateStr[3];
      if (st <= moment(tempDate).format("DD/MM/YYYY")) {
         let action = habit.completions.get(
            moment(tempDate).format("DD/MM/YYYY").toString()
         );
         arr.push({ date: tempDate, action: action });
      }
   }

   //Difference in number of days

   return res.render("habit", {
      habit: habit,
      lastDays: arr,
   });
});

const takeAction = asyncHandler(async (req, res) => {
   console.log("take action calling");
   const habit = await Habit.findById(req.params.id);

   let date = moment()
      .subtract(req.body.dayBefore, "days")
      .format("DD/MM/YYYY");

   const completionsMap = habit.completions;

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

   // const record = recordsCalculate(completionsMap);
   let bestScore = 0,
      currentScore = 0,
      success = 0,
      totalDays = 0;

   for (d of completionsMap) {
      totalDays++;
      if (d[0] == moment().format("DD/MM/YYYY").toString()) {
         console.log("break hua hai ", d[0], currentScore);
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

   // console.log("best = " + bestScore + " current => " + currentScore);
   // console.log("success = " + success + " total => " + totalDays);

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

const habitDelete = asyncHandler(async (req, res) => {
   let habit = await Habit.findById(req.params.id);
   habit.remove();

   const user = await User.findOne({ userName: "Guest" });

   let post = await User.findByIdAndUpdate(user._id, {
      $pull: { habits: req.params.id },
   });

   return res.redirect("back");
});

const extendDate = asyncHandler(async (req, res) => {
   const habit = await Habit.findById(req.params.id);

   let completionsMap = habit.completions;

   // var start = moment(habit.start, "DD/MM/YYYY");
   var end = moment(habit.end+1, "DD/MM/YYYY");
   var today = moment(new Date(), "DD/MM/YYYY");
   let totalDays = end.diff(start, "days");

   for (let d = 0; d <= totalDays; d++) {
      var new_date = moment(habit.start, "DD/MM/YYYY");
      let date = new_date.add(d, "days").format("DD/MM/YYYY");
      completionsMap.set(date, "None");
   }
   await Habit.updateOne(
      { _id: habit._id },
      {
         $set: {
            completions: completionsMap,
         },
      }
   );
});

module.exports = { home, add, showHabit, takeAction, habitDelete, extendDate };
