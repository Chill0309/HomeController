var ChannelFeed = require('../models/channelfeed.js');
var FeedValue = require('../models/feedvalue.js');

// Index listing
exports.index = function(req, res) {
	ChannelFeed.find({}).sort('group name').execFind(function(err, feeds) {
	    if (err) {
	    	res.send('Error displaying list of ChannelFeeds');
	    } else {
	    	res.render('channelfeeds/index', { title: 'Channel Feeds', items : feeds, itemcount : feeds.length });
	    }
	});
};

// Show single feed
exports.showfeed = function(req, res) {
	var id = req.params.id;
	
	ChannelFeed.find({_id : id}).limit(1).execFind(function(err, feed) {
	    if (err) {
			res.send('Error finding ChanelFeed with id of ' + id);
	    } else {	    
	    	// Find feed values
	    	FeedValue.find({feedid : id}).limit(30).sort('-timestamp').execFind(function(err, values) {
	    		if (err) {
	    			res.send('Error finding FeedValues for feed ' + id);
	    		}  else {
	    			console.log(feed);
	    			console.log(values);
	    			res.render('channelfeeds/show', { title: 'Feed ' + id, id : id, item : feed[0], values : values });
	    		}
	    	});	    
	    }
	});
};
