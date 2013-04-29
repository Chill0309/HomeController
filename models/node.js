/*
var mongoose = require('mongoose');
var NodeChannel = require('./channel.js');

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

// Register the model name
module.exports = mongoose.model('SensorNode', SensorNode);
*/

var ModelBase = require('./model.js');

module.exports = ModelBase.extend({
    tableName: "nodes",
});
