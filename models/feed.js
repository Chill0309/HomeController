var mongoose = require('mongoose');

// Define the model
var ChannelFeed = new mongoose.Schema({
	name : String,
	group : String,
	units : String,
	lastvalue : Number,
	lastupdated : Date
});

// Register the model name
module.exports = mongoose.model('ChannelFeed', ChannelFeed);

