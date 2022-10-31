const router = require("express").Router();
const {
   home,
   add,
   showHabit,
   takeAction,
   habitDelete,
   extendDate,
} = require("../controller.js/habitController");

// For rendering different pages and controllers

router.get("/", home);
router.post("/add-habit", add);
router.get("/delete/:id", habitDelete);
router.get("/view/:id", showHabit);
router.post("/active/:id", takeAction);
router.post("/update/:id", extendDate);

module.exports = router;
