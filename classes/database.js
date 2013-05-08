var mongoose = require('mongoose');
var redis = require('redis');

var FeedValue = require('../models/feedvalue.js');
var feedvalues = new FeedValue();

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


exports.GetGraphData = function(data, socket) {
	var feedId = data.feedid;
	
	// Get the data for the last day
	var searchTime = Date.now() - (24 * 60 * 60 * 1000);
	var startDate = this.ConvertDateToMySQL(new Date(searchTime));
	
	// Query data, get times as the number of seconds since the start date
	feedvalues.query("SELECT VALUE AS y, TIMESTAMPDIFF(SECOND, '" + startDate + "', timestampA) AS x, TIMESTAMPDIFF(SECOND, '" + startDate + "', timestampB) AS x2 FROM feedvalues WHERE feedid=" + feedId + " AND timestampA >= '" + startDate + "'",
					function(err, rows, fields) {
		var chartData = [];
		
		// Loop through each point and add it to the data point collection
		var dataPoints = [];
		rows.forEach(function(item) {
			// Add the start point to the graph
			// For some reason we need to take an hour off the time? DST??
			dataPoints.push({ x: (item.x * 1000) + searchTime - (60 * 60 * 1000), y: item.y });
		
			// If the end time for this point is different than the start point
			if (item.x != item.x2)
			{
				// Add the end point as a seperate point on the graph
				dataPoints.push({ x: (item.x2 * 1000) + searchTime - (60 * 60 * 1000), y: item.y });
			}
		});
		chartData.push(dataPoints);
		
		// Map the data collection to a key/value pair to send to the graph
		var result = chartData.map(function(data, i) {
			return { 
				key: 'FeedID ' + feedId,
				values: data
			};
		});
		
		// Send the graph data back to the client
		socket.emit('graphdata', { feedid: feedId, data: result });
	});

	// Loop for data for the past 30 days
	var searchTime2 = Date.now() - (1000 * 24 * 60 * 60 * 30);
	var startDate2 = this.ConvertDateToMySQL(new Date(searchTime2));	
	
	// Query data, group values per day
	feedvalues.query("SELECT DAYOFYEAR(timestampA) AS DAY, YEAR(timestampA) AS YEAR,FLOOR(SUM(VALUE*readingcount)/SUM(readingcount)) AS average FROM feedvalues WHERE feedid=" + feedId + " AND timestampA >= '" + startDate2 + "' GROUP BY ((YEAR(timestampA) * 1000) + DAYOFYEAR(timestampA));",
					function(err, rows, fields) {
		var chartData = [];
		
		// Loop through each point and add it to the data point collection
		var dataPoints = [];
		var i = 0;
		rows.forEach(function(item) {
			dataPoints.push({ x: i++, y: item.average});
		});
		chartData.push(dataPoints);
		
		// Map the data collection to a key/value pair to send to the graph
		var result = chartData.map(function(data, i) {
			return {
			  key: 'Daily Summary' + i,
			  values: data
			};
		});
		
		// Send the graph data back to the client
		socket.emit('summarygraphdata', { feedid: feedId, data: result });
	});
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