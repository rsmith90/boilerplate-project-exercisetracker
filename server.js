const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Schema } = require("mongoose");
const { addNewUser, getAllUsers, addNewExercise, fetchExercisesLog } = require("./db.js");

require("dotenv").config();

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// DataBase initialize
const uri = process.env["moonDB"];

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.error(err);
    console.log("Connected to Database!");
  }
);

app.get("/mongo-health", (request, response) => {
  response.json({ status: mongoose.connection.readyState });
  console.log("Connected to Database");
});

// creating new user
app.post("/api/users", async (req, res, next) => {
  console.log(req.body.username);
  const userName = req.body.username;
  if (!userName || userName.length === 0) {
    return res.json({ error: "Invalid username" });
  } else {
    try {
      const newUser = await addNewUser(userName);
      console.log(newUser);
      res.json({
        username: newUser.username,
        _id: newUser._id,
      });
    } catch (e) {
      console.error(e);
    }
  }
});

// Getting list of Users
app.get("/api/users", async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.json(allUsers);
  } catch (e) {
    console.error(e);
  }
});

// Adding Exercises
app.post("/api/users/:_id/exercises", async (req, res, next) => {
  // console.log(req);
  const userId = req.params._id || req.body._id;
  const todaysDate = new Date();
  const yyyy = todaysDate.getFullYear();
  const m = todaysDate.getMonth();
  const d = todaysDate.getDate();
  const dateStr =
    yyyy + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);

  const datePartOnly = req.body.date ? req.body.date : dateStr;
  try {
    const newExercise = await addNewExercise({
      id: userId,
      description: req.body.description,
      duration: req.body.duration,
      date: datePartOnly,
    });
    if (newExercise) {
      res.json(newExercise);
      console.log("Added New Exercise!");
    } else {
      console.log(newExercise);
      res.end();
    }
  } catch (e) {
    console.error(e);
  }
});

// Logs of exercises
app.get("api/users/:_id/logs", async (req, res, next) => {
  const userId = req.params["_id"];
  const { from, to, limit } = req.query;
  // console.log(req.params);
  // console.log(req.query);
  const objToProcess = {
    userId: userId,
    fromDate: from,
    toDate: to,
    limit: limit
  };
  try{
   const exercisesLog = await fetchExercisesLog(objToProcess);
    if(exercisesLog){
      res.json(exercisesLog)
    }else{
      console.log(exercisesLog)
      res.end()
    }
  } catch (e) {
    console.error(e);
  }
});
