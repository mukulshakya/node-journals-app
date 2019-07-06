const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const {rootpath} = require('./rootpath');
const fs = require('fs');
const {authenticationMiddleware} = require('./authentication');
const {encrypt, decrypt} = require('./compress');


function checkfile() {
  let checkpath = path.join(rootpath,'data');
  try {
    let fetched = fs.readFileSync(`${checkpath}\\details.json`);
    let fetchedparsed = JSON.parse(fetched);
    if(!fetchedparsed.length) fs.writeFileSync(`${checkpath}\\details.json`,JSON.stringify([]));
  }
  catch(e) {
    fs.writeFileSync(`${checkpath}\\details.json`,JSON.stringify([]))
  }
}

function checkfile1() {
  let checkpath1 = path.join(rootpath,'data');
  try {
    let fetched1 = fs.readFileSync(`${checkpath1}\\data.json`);
    let fetchedparsed1 = JSON.parse(fetched1);
    if(!fetchedparsed1.length) fs.writeFileSync(`${checkpath1}\\data.json`,JSON.stringify([]));
  }
  catch(e) {
    fs.writeFileSync(`${checkpath1}\\data.json`,JSON.stringify([]))
  }
}



// setting up port
const port = process.env.PORT || 3000;

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res) {
    res.render('index',{title: 'Home'});
});

//decryption 

app.post('/decrypter', (req, res) => {
  let content = decrypt(req.body.content);
  res.send({content});
});

// Route Files
let users = require('./routes/users');
let journals = require('./routes/journal');
app.use('/users', users);
app.use('/journals', journals);

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));


checkfile();
checkfile1();
