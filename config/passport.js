const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const {rootpath} = require('../rootpath');
const {encrypt, decrypt} = require('../compress');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){

      let detailspath = path.join(rootpath, 'data');
      let details = fs.readFileSync(`${detailspath}\\details.json`,(err) => {
        if(err) return console.log('Error Reading File');
      });

      let detailsParsed = JSON.parse(details);

    let user = detailsParsed.find(x => x.username === username);

    if(!user){
      console.log('no user found');
      return done(null, false, {message: 'No user found'});
    }
    
    // Match Password
    bcrypt.compare(password, user.password, function(err, isMatch) {
        if(err) throw err;
        if(isMatch){
          console.log('password matched');
          return done(null, user);
        } 
        else {
          console.log('wrong password');
          return done(null, false, {message: 'Wrong password'});
        }
    });
  
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}
