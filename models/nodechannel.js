var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NodeChannel = new Schema({
  channelindex : Number,
  name : String
});

module.exports = mongoose.model('NodeChannel', NodeChannel);
