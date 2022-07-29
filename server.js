const express = require("express");
const mongoose = require("mongoose");
const {addNewUser} = require('./db.js')
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// const { Schema } = require("mongoose");
require("dotenv").config();
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors()) 

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

// DataBase initialize
const uri = process.env['moonDB'];
// { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if(err) console.error(err);
  console.log('Connected to Database')
});

app.get("/mongo-health", (request, response) => {
  response.json({ 
    status: mongoose.connection.readyState
    });
});


app.post('/api/users/', async(req, res) =>{
  console.log(req)
})

