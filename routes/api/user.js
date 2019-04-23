const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

// load input validation
const validateRegisterInput = require('../../validation/register')

//load User Model
const User = require("../../modles/User");

// @route GET api/user/test
// @desc test user route
// @access public

router.get("/test", (req, res) =>
  res.json({
    msg: "users works"
  })
);

// @route GET api/user/register
// @descregister user
// @access public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  
  // check validate
  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // defualt
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/user/login
// @descregister login user / returning JWT Token
// @access public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({
    email
  }).then(user => {
    // check for user
    if (!user) {
      return res.status(404).json({
        email: "user not found!"
      });

      //check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // user matched

          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          } //create JWT payload

          //sign Token
          jwt.sign(payload,
            keys.secretOrKey, {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
        } else {
          return res.status(400).json({
            password: "password incorrect"
          });
        }
      });
    }
  });
});

// @route GET api/user/current
// @descregister return current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router;