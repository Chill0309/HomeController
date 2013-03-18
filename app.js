// HomeController Node Project
// Author: Paul Chilton

var express = require('express')
  , routes = require('./routes')
  , map = require('./maproutecontroller')
  , user = require('./routes/user')
  , async = require('async')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , timers = require('timers')
  , socketio = require('socket.io');

var SensorNode = require('./models/sensornode');

/*
mongoose.connect('mongodb://127.0.0.1/WidgetDB');

mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});
*/

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: require('./node_modules/serialport/serialport.js').parsers.readline("\n")
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('RX << ' + data);
  });  
});



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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/test', function(req,res) 
{
  console.log(req);
});

var prefixes = ['widgets', 'sensornodes'];
prefixes.forEach(function(prefix) {
    map.mapRoute(app, prefix);
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    
    var io = socketio.listen(server);

    console.log("Socket.IO Listen");

    io.sockets.on('connection', function (socket) {        
        timers.setInterval(function() {
            console.log("TICK");
            socket.emit('news', { news: 'world' });
        }, 1000);

        
        socket.on('echo', function (data) {
            socket.emit('news', { news: data.back });
        });      
    });    
});
