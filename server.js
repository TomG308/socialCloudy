const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const user = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB config
const db = require('./config/keys').mongoURI

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('mongoDB connect'))
  .catch(err => console.log(err))

// passport middleware

app.use(passport.initialize())

// passport Config
require('./config/passport.js')(passport)

//use routes

app.use('/api/users', user)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server is running on port ${port}`))