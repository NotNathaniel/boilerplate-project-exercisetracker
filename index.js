// Do not edit from here
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const users = [];
const logs = [];

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Ok to edit from here
app.post("/api/users", (req, res) => {
  const username = req.params.username;
  const _id = generateRandomString();
  const userObject = { username: username, _id: _id };
  users.push(userObject);
  logs.push({ ...userObject, count: 0, logs: [] });
  res.json(userObject);
});

app.get("/api/users", (req, res) => {
  return users;
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let { _id, description, duration } = req.params;
  description = description.toString();
  duration = parseInt(duration);
  let date = req.params.date;
  date = date ? new Date(date) : new Date();
  date = date.toDateString();

  const user = getUserById(_id);
  const log_object = { description: description, duration: duration, date: date };
  logs.forEach(({ log }) => {
    if (log._id == _id) {
      log.count += 1;
      log.log.append(log_object);
    }
  });
  const exercise = { ...user, ...log_object };

  res.json(exercise);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const _id = req.params._id;
  const {from, to, limit} = req.query;
  let filteredLogs = getLogByUserId(_id);

  if(from){
    filteredLogs = filteredLogs.filter((log)=>{new Date(log.date)> new Date(from)});
  }
  if(to){
    filteredLogs = filteredLogs.filter((log)=>{new Date(log.date) < new Date(to)});
  }

  if(limit){
    filteredLogs = filteredLogs.splice(0, limit);
  }

  res.json(filteredLogs)

});

function generateRandomString(length = 24) {
  const characters = "0123456789abcdef"; // Characters allowed (numbers and letters a-f)
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function getUserById(_id) {
  return users.filter(({ user }) => {
    user._id == _id;
  })[0];
}

function getLogByUserId(_id){
  return logs.filter(({ lg }) => {
    log._id == _id;
  })[0];
}

// Do not edit from here
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
