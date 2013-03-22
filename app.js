// HomeController Node Project
// Author: Paul Chilton

var express = require('express')
  , async = require('async')
  , http = require('http')
  , path = require('path')
  , timers = require('timers')
  , socketio = require('./classes/socketio.js')
  , event = require('./classes/event.js')
  , database = require('./classes/database.js')
;

// Start the serial port listening
var serialport = require('./classes/serial.js')
serialport.start();

// Create and configure the express application
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next) {
    throw new Error(req.url + ' not found');
  });
  app.use(function(err, req, res, next) {
    console.log(err);
    res.send(err.message);
  }); 
});

// Set in development mode and add an error handler
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Load routes
require('./routelist.js')(app);

// Start the HTTP server listening
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    
	// Start Socket.IO
	socketio.start(server);
	
	/*
	timers.setInterval(function() {
	console.log("TICK");
	socket.emit('news', { news: 'world' });
	}, 1000);
	*/
});
