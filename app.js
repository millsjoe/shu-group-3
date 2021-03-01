const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');
const methodOverride = require('method-override');

//Creating App
const app = express();

//Passport config
require('./config/passport')(passport);

//DB Connection
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//CSS + JavaScript
app.use(express.static(__dirname + '/public'));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
);

// Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));
app.use('/ratings', require('./routes/ratings'));
app.use('/admin', require('./routes/admin'));
app.use('/shops', require('./routes/shops'));

//Listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// unsure how to connect the html to the localhost
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
