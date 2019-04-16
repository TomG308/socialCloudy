const express = require('express')
const mongoose = require('mongoose')

const user = require('./routes/api/user')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')


const app = express()

// DB config
const db = require('./config/keys').mongoURI

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('mongoDB connect'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world'))

//use routes

app.use('/api/user', user)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server is running on port ${port}`))