var mongoose = require('mongoose');
var mongooseRedisCache = require('mongoose-redis-cache');
var NodeChannel = require('./nodechannel.js');

// Define the model
var SensorNode = new mongoose.Schema({
  rfgroup : { type: Number, require: true },
  rfnodeid : { type: Number, require: true },
  location : String,
  packetversion : { type: Number, require: true },
  firmware : String,
  pcb : String,
  sensors : [NodeChannel.NodeChannel],
  updateInterval : Number,
  lastseen : { type: Date, default: Date.now }
});

// Set the model to be cachable in redis
//SensorNode.set('redisCache', true);
//SensorNode.set('expires', 30);
	
// Register the model name
module.exports = mongoose.model('SensorNode', SensorNode);
