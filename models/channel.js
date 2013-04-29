/*
var mongoose = require('mongoose');

// Define the model
var NodeChannel = new mongoose.Schema({
  channelindex : Number,
  name : String,
  units : String,
  divider : Number,
  lastvalue : Number,
  feedname : String 
});

// Register the model name
module.exports = mongoose.model('NodeChannel', NodeChannel);

*/

var ModelBase = require('./model.js');

module.exports = ModelBase.extend({
    tableName: "channels",
});
