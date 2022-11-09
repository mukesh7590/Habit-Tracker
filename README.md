# Habit-Tracker

-  Coding Ninjas Skill Test Assignment



## About The Project

You cannot able to keep your habit or want to create new habit. Then try this amazing app Habit Tracker
A basic Habit Tracking System. Tech Stack : HTML, CSS, JS, Node.js

### Features :

-  Add multiple habits to track like reading a book, going to the gym etc.
-  Track each habit everyday. These are the 3 statuses of a habit:
   -  Done - Mark the habit as done for a day.
   -  Not done - Mark the habit as not done for a day
   -  None - User did not take any action on a habit for a day
-  A view to show all current habits. Here give an add button where you can add a new habit to track.
-  A view to display 7 days of each habit
   -  Show today where user can mark todays habit
   -  And show the previous 6 days and the status of that habit for each day
   -  A user can toggle between the three (above mentioned) statuses of a habit i.e. I can change today’s status as done, not done or none anytime.
   -  Also I should be able to change any of the previous days status i.e. I can change the status of a habit for yesterday, day before yesterday or any previous 6 days as well
-  You can keep track of the longest streak and the number of days the user completed that habit since the user created the habit (like in the detail view above the user did 38 workouts from 82 days).

### Built With

Here is the Technology Stack of this Application. which I have used to Built this Application.

-  MongoDB
-  Express
-  NodeJS
-  HTML
-  SCSS

<!-- GETTING STARTED -->

## Getting Started

-  Clone this project
-  Start by installing npm and mongoDB if you don't have them already.
-  Run the Mongo Server.



## Directory Structure and flow of The Code

This code follows MVC pattern and hence everything is differentiated and well managed:

    Habit_tracker
        |-----assets
        |       |--- css
        |       |     |-- habit.css
        |       |     |-- home.css
        |       |     └-- layout.css
        |       |--- sass
        |             |-- habit.scss
        |             |-- home.scss
        |             └-- layout.scss
        |------ config
        |         └--- mongoose.js
        |------ controllers
        |         └--- habitController.js
        |------ models
        |         └--- habit.js
        |         └--- user.js
        |------ routes
        |         └--- index.js
        |------ views
        |         |--- habit.ejs
        |         |--- home.ejs
        |         └--- layout.ejs
        |------ .gitignore
        |------ index.js
        |------ package.json
        |------ package-lock.json
        └------ README.md

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request
