var ChannelFeed = require('../models/feed.js');
var FeedValue = require('../models/feedvalue.js');

// Index listing
exports.index = function(req, res) {
	ChannelFeed.find().distinct('group', function(error, groups) {
		ChannelFeed.find({}).sort('group name').execFind(function(err, feeds) {
		    if (err) {
		    	res.send('Error displaying list of ChannelFeeds');
		    } else {
		    	res.render('channelfeeds/index', { title: 'Channel Feeds', groups : groups, items : feeds, itemcount : feeds.length });
		    }
		});
	});
};

// Show single feed
exports.showfeed = function(req, res) {
};

// Display new form
exports.displaynew = function(req, res) {

};

// Add a SensorNode
exports.create = function(req, res) {

};

// Show a SensorNode
exports.show = function(req, res) {
	var id = req.params.sn;
	console.log("Looking up feed id " + id);
	ChannelFeed.find({_id : id}).limit(1).execFind(function(err, feed) {
	    if (err) {
			res.send('Error finding ChanelFeed with id of ' + id);
	    } else {
	    	// Find feed values
	    	console.log("Looking up feed values");
	    	FeedValue.find({feedid : id}).sort('-timestampB').limit(100).execFind(function(err, values) {
	    		if (err) {
	    			res.send('Error finding FeedValues for feed ' + id);
	    		}  else {
	    			console.log("Got data");
					//console.log(feed);
	    			//console.log(values);
	    			res.render('channelfeeds/show', { title: 'Feed ' + id, id : id, item : feed[0], values : values });
	    		}
	    	});	    
	    }
	});
};

// Delete a SensorNode
exports.destroy = function(req, res) {

};

// Display edit form
exports.edit = function(req, res) {

};

// Update a SensorNode
exports.update = function(req, res) {

};

// Display the edit form for a property
exports.editProperty = function(req, res) {

};

// Update a property of a SensorNode
exports.updateProperty = function(req, res) {

};
