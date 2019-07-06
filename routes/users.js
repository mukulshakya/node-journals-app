const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
// const {encrypt, decrypt} = require('../compress')
const path = require('path');
const {rootpath} = require('../rootpath');
// const {db, user} = require('../app');
const {authenticationMiddleware} = require('../authentication')

// Register Form
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'});
});

// Register Proccess
router.post('/register',[
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.send({msg:"danger"});
  } else {
      let newUser = {
          username: req.body.username,
          password: req.body.password
      }

      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
            let detailspath = path.join(rootpath, 'data');
            let details = fs.readFileSync(`${detailspath}\\details.json`)
            let detailsParsed = JSON.parse(details)

            let duplicateUser = detailsParsed.find(user => user.username === newUser.username);

            if(duplicateUser) res.send({msg:"danger",msg1:"username already taken"});

            else {
              detailsParsed.push(newUser);
                fs.writeFile(`${detailspath}/details.json`,JSON.stringify(detailsParsed),(err) => {
                if(err) res.send({msg:"danger",msg1:"Error registering user."});
                else res.send({msg:"success",msg1:"You've been successfully registered."});
              });
            }
    
            
            });
          });
      }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login', {title: 'Login'});
});

// Login Process
router.post('/login',  passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/journals');
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;
