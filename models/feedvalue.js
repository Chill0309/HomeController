var mongoose = require('mongoose');

// Define the model
var FeedValue = new mongoose.Schema({
	feedid : String,
	value : Number,
	timestampA :  { type: Date, default: Date.now },
	timestampB :  { type: Date, default: Date.now }
});

// Register the model name
module.exports = mongoose.model('FeedValue', FeedValue);
