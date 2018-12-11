var express 			= require('express');
var path 				= require('path');
var cookieParser		= require('cookie-parser');
var bodyParser 			= require('body-parser');
var exphbs				= require('express-handlebars');
var expressValidator 	= require('express-validator');
var flash 				= require('connect-flash');
var session 			= require('express-session');
var passport		    = require('passport');
var LocalStrategy 		= require('passport-local').Strategy;
var mongo 				= require('mongodb');
var mongoose 			= require('mongoose');
const database          = require('./config/database');
const http              = require('http');

var users = require('./routes/users');

// Init App
var app = express();

  
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.static(path.join(__dirname, '../client/src/app')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());


app.use('/users', users);

// Initialize connection once
mongoose.connect(database.openUri, function(err, database) {
  if(err) throw err;

  db = database;
  
  // Start the application after the database connection is ready

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
});
		
