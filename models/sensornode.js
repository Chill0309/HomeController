var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorNode = new Schema({
  id : { type: Number, require: true, trim: true, unique: true },
  rfgroup : { type: Number, require: true },
  rfnodeid : { type: Number, require: true },
  location : String,
  packetversion : { type: Number, require: true },
  firmware : String,
  pcb : String,
  sensors : String,
  updateInterval : Number
});

module.exports = mongoose.model('SensorNode', SensorNode);