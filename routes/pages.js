var feeds = require('../controllers/feeds.js');

exports.feedlist = function(req, res){
	feeds.index(req, res);
};

exports.showfeed = function(req, res){
	feeds.showfeed(req, res);
};

