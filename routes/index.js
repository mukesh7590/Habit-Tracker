const router = require("express").Router();
const {
   home,
   add,
   showHabit,
   takeAction,
   habitDelete,
} = require("../controller.js/habitController");

// For rendering different pages and controllers
// home page route
router.get("/", home);

// adding the habit route
router.post("/add-habit", add);

// deleting the habit route
router.get("/delete/:id", habitDelete);

// show the habit route
router.get("/view/:id", showHabit);

// actions taken by the user
router.post("/active/:id", takeAction);

module.exports = router;
