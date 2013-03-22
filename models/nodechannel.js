var mongoose = require('mongoose');
var mongooseRedisCache = require("mongoose-redis-cache");

// Define the model
var NodeChannel = new mongoose.Schema({
  channelindex : Number,
  name : String,
  units : String,
  divider : Number,
  lastvalue : Number
});

// Set the model to be cachable in redis
//NodeChannel.set('redisCache', true);
//NodeChannel.set('expires', 30);

// Register the model name
module.exports = mongoose.model('NodeChannel', NodeChannel);

