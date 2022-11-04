const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/mongoose");
const sassMiddleware = require("node-sass-middleware");
const moment = require("moment");
const expressLayout = require("express-ejs-layouts");

// =============== dotEnv configuration and dataBase connection call ====================

dotenv.config();
connectDB();

moment().format();

// ======= SCSS ========

app.use(
   sassMiddleware({
      src: path.join(__dirname, "./assets/sass"),
      dest: path.join(__dirname, "./assets/css"),
      debug: false,
      outputStyle: "compressed",
      prefix: "/css",
   })
);



// ------Statics files ------ //
app.use(express.static(path.join(__dirname, "./assets")));
app.use(express.urlencoded());

// ------ EJS layouts ------//
app.use(expressLayout);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// ======= EJS ========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Load Router
app.use("/", require("./routes/index"));

app.listen(process.env.PORT, (error) => {
   if (error) {
      console.log("error in the port");
   }
   console.log(
      `     

      ******************* HEY! SERVER IS RUNNING on Link :  http://localhost:${process.env.PORT} **********************
      
      `
   );
});
