const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const SALT_COUNT = 10;

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// app.get('/login', async (req, res, next) => {
//   try {
//     let {username, password} = req.body;
//     // const hasedPassword = await bcrypt.hash(password, SALT_COUNT);
//     // let createdUSer = await User.create({username, password: hasedPassword})
//     let user = await User.findOne({where: {username}})
//     res.send(user);
//   } catch (error) {
//     console.error(error);
//     next(error)
//   }
// });

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  try {
    let {username, password} = req.body;
    const hasedPassword = await bcrypt.hash(password, SALT_COUNT);
    let createdUSer = await User.create({username, password: hasedPassword})
    res.status(200).send(`successfully created user ${createdUSer.username}`)
  } catch(error) {
    console.log("Post register: ", error)
    next(error)
  }
})
// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    let {username, password} = req.body;
    let user = await User.findOne({where: {username}})
    if(user) {
      const isMatch = await bcrypt.compare(password, user.password)
      // isMatch should return true if password === user.password
      // console.log("Password match: ", isMatch);
      console.log(user.password)
      // res.send("Password match: ", isMatch);
      if (isMatch) {
        res.status(200).send(`successfully logged in user ${user.username}`)
      } else {
        res.status(401).send("incorrect username or password")
      }
    }

  } catch(error) {
    console.log("Post login: ", error)
    next(error)
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
