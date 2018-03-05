'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

//Set up mongoose connection
var mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MLAB_URI)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'mongodb error: '))

db.once('open', () => console.log('mongodb connected'))


const User = require('./models/User');
const ExerciseLog = require('./models/ExerciseLog');
    

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Create post end-point to add a new user to the db
// User db fields:
// username: String,
// _id: id_type
//POST /api/exercise/add_user
// return JSON
app.post('/api/exercise/new-user', (req,res) => {
  console.log(req.body);
  User.findOne({username: req.body.username}, (err, result) => {
    if (err) return console.error(err);
    console.log(result);
    if (!result) {
      let user = new User;
      user.username = req.body.username;
      user.save((err, user) => {
        if (err) console.err(err);
        res.json({username: user.username, _id: user._id});
      });
    } else {
      res.send(`${req.body.username} already exists`);
    }
  });
              
});

//Create post end-point to add exercise
// exercisedb fields:
// username: String
// description: String
// duration: Number
// _id: User ID
// date: Date
// POST /api/exercise/add
// return JSON
app.post('/api/exercise/add', (req,res) => {
  // console.log(req.body);
  
  User.findById(req.body.userId, (err, result) => {
    if (err) throw console.error(err);
    console.log(`the result ${result}`);
    if (result) {
      let exerciseLog = new ExerciseLog;
      exerciseLog._userId = result._id;
      exerciseLog.description = req.body.description;
      exerciseLog.duration = req.body.duration;
      if (req.body.date != '') 
        exerciseLog.date = new Date(req.body.date);
      console.log('exercise log');
      console.log(exerciseLog);
      exerciseLog.save((err, exerciseLog) => {
        if (err) return console.error(err);
        res.json({
          username: result.username,
          description: exerciseLog.description,
          duration: exerciseLog.duration,
          userId: exerciseLog._userId,
          date: exerciseLog.date
        });
      });
    } else {
      res.send(`User ${req.body._id} not found.`);
    }
  });
});

//Create get method
// GET /api/exercise/log?{userId}[&from][&to][&limit]
app.get('/api/exercise/log', (req, res) => {
  let params = Object.keys(req.query);
  console.log(`url: ${req.url}`);
  console.log(params);
  console.log(`param count: ${params.length}`);

  let userId, from, to, limit;
  
  // Parse the parameters and do search
  if (params.length === 1 ) {
    userId = params[0];
    ExerciseLog.
      find({_userId: userId}).
      exec(function (err, results) {
        if (err) console.error(err);
        if (results.length == 0) {
          res.send('unknown userId');
        } else {
          res.json(results);
          console.log(JSON.stringify(results));
        }
      }); 
  } else if (params.length === 3) {
    userId = params[0];
    from = new Date(params[1]);
    to = new Date(params[2]);
    ExerciseLog.
      find({_userId: userId}).
      where('date').gt(from).lt(to).
      exec(function (err, results) {
        if (err) console.error(err);
        if (results.length == 0) {
          res.send('unknown userId');
        } else {
          res.json(results);
          console.log(JSON.stringify(results));
        }
      }); 
  } else if (params.length === 4) {
    userId = params[1];
    limit = parseInt(params[0]);
    from = new Date(params[2]);
    to = new Date(params[3]);
    ExerciseLog.
      find({_userId: userId}).
      where('date').gt(from).lt(to).
      limit(limit).
      exec(function (err, results) {
        if (err) console.error(err);
        if (results.length == 0) {
          res.send('unknown userId');
        } else {
          res.json(results);
          console.log(JSON.stringify(results));
        }
      }); 
  }
  
  console.log(!userId ? `required userId parm` : `userId: ${userId}`);
  console.log(!from ? `from: no from parm` : `from: ${from}`);
  console.log(!to ? `to: no to parm`:`to: ${to}`);
  console.log(!limit ? `limit: no limit parm` :`limit: ${limit}`);
    
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
