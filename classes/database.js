var mongoose = require('mongoose');
var redis = require('redis');

// Connect to mongodb
mongoose.connect('mongodb://127.0.0.1/HomeController1');
mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});

// Connect to redis
var redisClient = redis.createClient();
redisClient.select(1);

// Collection to locally store sensor nodes to reduce database overhead
// SensorNodes are stored indexed by the nodeId
exports.SensorNodeCollection = [];

// The most recent feed value for each feed is stored in memory
exports.FeedValues = [];

// Feed details (NOT YET STORED IN MEMORY....)
exports.Feeds = [];


exports.ConvertDateToMySQL = function(date) {
	var result = "";
	result = date.getUTCFullYear() + '-' +
		('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
		('00' + date.getUTCDate()).slice(-2) + ' ' + 
		('00' + date.getUTCHours()).slice(-2) + ':' + 
		('00' + date.getUTCMinutes()).slice(-2) + ':' + 
		('00' + date.getUTCSeconds()).slice(-2);
	return result;
};


/*
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) console.log("MYSQL ERROR!");
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
*/