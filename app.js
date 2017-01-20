var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// mongodb
// var mongo = require('mongodb');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/loginapp');
// var db = mongoose.connection;

// Redis
var redis = require("redis");
client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});



// set up routers
var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
// make an instance of express class
var app = express();

// View Engine: handlebars
// https://github.com/ericf/express-handlebars
// views is a default setting
// set views's location to views directory
app.set('views', path.join(__dirname, 'views'));
// specify the extension of view engine file, in this case is handlebars
// handlebar's index page is in the layout directory
// index page must be nameds as layout.handlebars for express handlebars
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
// set the key view engine with value handlebars
app.set('view engine', 'handlebars');

// BodyParser Middleware
// https://expressjs.com/en/api.html
// this is for the request form from the register page
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookieParser??
// app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
// this is for flash message
// req.flash require session to store message
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
// https://github.com/ctavan/express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());

// Local Vars during req and res cycle
// https://expressjs.com/en/api.html#res.locals
// set local vars for view handler
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // this is for logout
  res.locals.user = req.user || null;
  next();
});


// app use routers
// http://expressjs.com/en/guide/routing.html
app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
