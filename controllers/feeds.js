var SensorNode = require('../models/node.js');
var NodeChannel = require('../models/channel.js');
var ChannelFeed = require('../models/feed.js');
var FeedValue = require('../models/feedvalue.js');
var Database = require('../classes/database.js');

var nodes = new SensorNode();
var channels = new NodeChannel();
var feeds = new ChannelFeed();
var feedvalues = new FeedValue();

// Index listing
exports.index = function(req, res) {
	feeds.query("SELECT * FROM feeds ORDER BY `group`, name", function(err, rows, fields) {
		if (err) {
			res.send('Error displaying list of ChannelFeeds');
		} else {
			var groups = [];
			var feeds = [];
			var lastgroupadded = "";
			rows.forEach(function(item) {
				if (item.group != lastgroupadded)
				{
					groups.push(item.group);
					lastgroupadded = item.group;
				}
				
				feeds.push(item);
			});
			
			res.render('channelfeeds/index', { title: 'Channel Feeds', groups : groups, items : feeds, itemcount : feeds.length });
		}
	});
};

// Show single feed
exports.showfeed = function(req, res) {

};

// Display new form
exports.displaynew = function(req, res) {

};

// Add a Feed
exports.create = function(req, res) {

};

// Show Feed Values
exports.show = function(req, res) {
	var id = req.params.sn;
	console.log("Looking up feed id " + id);
	feeds.find('all', {where : "id=" + id}, function(err, rows, fields) {
	    if (err) {
			res.send('Error finding ChanelFeed with id of ' + id);
	    } else {
			// Get the feed
			var feed = rows[0];
		
	    	// Calculate the average daily value for the specified feed
			feedvalues.query("SELECT FLOOR(SUM(VALUE*readingcount)/SUM(readingcount)) AS average FROM feedvalues WHERE feedid=" + id + " AND (YEAR(timestampA) = YEAR(NOW())) AND (DAYOFYEAR(timestampA) = DAYOFYEAR(NOW()));", function(err, rows, fields) {
	    		if (err) { 
	    			res.send('Error finding FeedValues for feed ' + id);
	    		}  else {
					var feedInformation = rows[0];
	    			var averageValue = feedInformation.average;
					
					// Work out the cost per month based on the average daily consumption
					// 720 hours in a month
					// 13.14 pence per kWh
					var energyCost = (averageValue / 1000) * 720 * (13.14 / 100);
					
					// Round values for display
					energyCost = Number(energyCost).toFixed(2);
					averageValue = Number(averageValue).toFixed(2);
					
					res.render('channelfeeds/show', { title: 'Feed ' + id, id : id, item : feed, averageValue : averageValue, energyCost : energyCost });
	    		}
	    	});	    
	    }
	});
};

// Delete a Feed
exports.destroy = function(req, res) {

};

// Display edit form
exports.edit = function(req, res) {

};

// Update a Feed
exports.update = function(req, res) {

};

// Display the edit form for a property
exports.editProperty = function(req, res) {

};

// Update a property of a Feed
exports.updateProperty = function(req, res) {

};
