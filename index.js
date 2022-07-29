const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Schema } = require("mongoose");
require("dotenv").config();

// Apps
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// DataBase initialize
const uri = process.env["moonDB"];

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/mongo-health", (request, response) => {
  response.json({ status: mongoose.connection.readyState });
});

// Database models
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
      date: String,
      duration: Number,
      description: String
    }],
  count: Number,
});
const User = mongoose.model("User", userSchema);

// Port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Endpoints

// save user
app
  .route("/api/users")
  .post((req, res) => {
    const username = req.body.username;
    const user = new User({ username, count: 0 });
    user.save((err, data) => {
      if (err) {
        res.json({ error: err });
      }
      res.json(data);
    });
  })
  .get((req, res) => {
    User.find((err, data) => {
      if (data) {
        res.json(data);
      }
    });
  });
// simone 62d1a1955a239415716d9b91
// moon 62d1a1ffd5b7051671ea4ac4

// Save Exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  const { description } = req.body
  const duration = parseInt(req.body.duration)
  const date = req.body.date ? "Mon Jan 01 1990" : 'Thu Nov 04 2021'
  const id = req.params._id
  // new Date.toDateString()
  // req.body.date
  // "Mon Jan 01 1990"

  const exercise = {
    date,
    duration,
    description,
  }

  User.findByIdAndUpdate(id, { 
    $push: { log: exercise },
    $inc: {count: 1}
  }, {new: true}, (err, user) => {
  if (user) {
    const updatedExercise = {
      _id: id, 
      username: user.username,
      ...exercise
    };
    // console.log(updatedExercise)
    res.json(updatedExercise)
  }
})
})


app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query
  console.log(from, to, limit)

  User.findById(req.params._id, (err, user) => {
    if (user) {
      if (from || to || limit) {
        const logs = user.log
        console.log(logs)
        const filteredLogs = logs
          .filter(log => {
            const formattedLogDate = (new Date(log.date)).toISOString().split('T')[0]
            console.log(formattedLogDate)
            return true
          })
        
        console.log(filteredLogs)
        const slicedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs
        user.log = slicedLogs
        console.log(slicedLogs)
      }

      res.json(user)
    }
  })
})


// .get((req, res) => {
//   user.find()
// })
//  Save Logs
// app.get('/api/users/:_id/logs',(req,res) => {
//   full exercise log of any user
//   returns user object (count) prop) of users exercises
//   exercises added in [array]
//   const user = userSchema
//   const { description } = req.body;
//   const duration = parseInt(req.body.duration);
//   const date = req.body.date ? 'Mon Jan 01 1990' : 'Thu Nov 04 2021'
//   const id = req.params._id;
//   const updatedExercise =

//   const exercise = {
//     description,
//     duration,
//     date,
//   };
// })

//
