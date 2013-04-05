var event = require('../classes/event.js');
var async = require('async');
var SensorNode = require('../models/sensornode.js');
var NodeChannel = require('../models/nodechannel.js');
var ChannelFeed = require('../models/channelfeed.js');
var FeedValue = require('../models/feedvalue.js');
var Database = require('../classes/database.js');

//FeedValue.find({}).remove();

function GetNode(data, callback) {
	async.waterfall([
		function(callback) {
			if (Database.SensorNodeCollection['Node' + data.nodeId]) {
				console.log("INFORMATION: Node " + data.nodeId + " exists in SensorNodeCollection");
				callback(null, Database.SensorNodeCollection['Node' + data.nodeId]);
			} else {
				console.log("INFORMATION: Adding Node " + data.nodeId + " to SensorNodeCollection");
				SensorNode.find({}).where("rfnodeid", data.nodeId).lean().execFind(function(err, nodes) {
					if (err) {
						callback('Error getting list of SensorNodes: ' + err, null);
					} else {
						// If the node does not exist
						if (nodes.length <= 0)
						{
							console.log("NodeId does not yet exist, creating it");
			
							// Create the node in the database
							var newNode = {
								rfgroup: 0,
								rfnodeid: data.nodeId,
								location: "New Node",
								packetversion: 0,
								pcb: "Unknown",
								firmware: "Unknown",
								sensors: new Array(),
								updateInterval: 0,
								lastseen: new Date()
							};
							
							var i = 0;
							data.values.forEach(function(value) {
								var channel = {
									channelindex : i++,
									name : "Channel " + i,
									divider : 100,
									lastvalue : value
								};
								
								newNode.sensors.push(new NodeChannel(channel));
							});
							
							// Save the new node object
							var obj = new SensorNode(newNode);
							obj.save(function (err, data) {
								if (err) {
									callback('Error saving node: ' + err, null);
								} else {
									event.emit('tobrowser', { message: 'sensornodeadded', nodeId: data.nodeId });
									
									// Locally store new node
									Database.SensorNodeCollection['Node' + data.nodeId] = obj;
									
									// Pass results to the next function in the sequence, err (arg1) = null
									callback(null, obj);
								}
							});
						}
						else
						{
						 	// Store node in local array
							Database.SensorNodeCollection['Node' + data.nodeId] = nodes[0];
							
							// Raise callback, passing the node back
							callback(null, nodes[0]);
						}
					}
				});
			}
		},
		function(node, callback) {			
			// Update sensor values
			// TODO: Deal with new sensor values added once the node exists
			var i = 0;
			data.values.forEach(function(value) 
			{
				node.sensors[i++].lastvalue = value;
			});
			
			// Save updates to node
			//nodes[0].lastseen = new Date();
			
			SensorNode.update({_id : node._id}, { lastseen : new Date(), sensors : node.sensors }, function(err) {
				if (err) {
					callback('Error updating node: ' + err, null);
				} else {
					// Raise event for the browser to update
					event.emit('tobrowser', { message: 'sensornodeupdated', item: node });
					
					// Pass results to the next function in the sequence, err (arg1) = null
					callback(null, node);
				}
			});
		}
	], function(err, result) {
		if (err) throw err;
		callback(null, result);
	});
}

function UpdateFeedValues(feedname, value, divider, units, node, callback) {
	async.waterfall([
		function(callback) {
			// Get the feed
			ChannelFeed.find({}).where("name", feedname).execFind(function(err, feeds) {
				if (err) {
					callback('Error looking up feed: ' + err, null);
				} else {
					callback(null, feeds[0], value, divider);
				}
			});
		},
		function (feed, value, divider, callback) {
			var newValue = (value / divider);
			var value = Database.FeedValues['FeedValue' + feed._id]; //values[0];
			
			if (value && value.timestampB && value.value == newValue)
			{
				// Update the feed value to stretch it's time until now
				FeedValue.update({_id : value._id}, { timestampB : new Date() }, function(err) {
					if (err) {
						callback('Error updating feed: ' + err, null);
					} else {
						Database.FeedValues['FeedValue' + feed._id].timestampB = new Date();
						event.emit('tobrowser', { message: 'feedvalueupdated', item: Database.FeedValues['FeedValue' + feed._id] });
					}
				});
			} else {
				// Create a new feed value
				var feedvalue = {
					feedid : feed._id,
					value : newValue,
					timestampA : new Date(),
					timestampB : new Date()
				};
				
				var obj = new FeedValue(feedvalue);
				obj.save(function (err, data) {
					if (err) {
						callback('Error saving feed value: ' + err, null);
					} else {
						Database.FeedValues['FeedValue' + feed._id] = obj;
						event.emit('tobrowser', { message: 'feedvalueadded', item: obj });
					}
				});
			}
			
			// Update the last value for the feed itself
			feed.lastvalue = newValue;
			feed.lastupdated = new Date();
			feed.units = units;
			event.emit('tobrowser', { message: 'channelfeedupdated', item: feed });				
			ChannelFeed.update({_id : feed._id}, { lastupdated : new Date(), lastvalue : newValue, units : units }, function(err) {
				if (err) {
					callback('Error updating feed: ' + err, null);
				} else {
					callback(null, 'DONE');
				}
			});
		}
	], function(err, result) {
		if (err) throw err;
		console.log('UpdateFeedValues: ' + result);
	});
}

module.exports = {
	// Stores a new received packet
	storepacket : function(data) {
		async.waterfall([
			function(callback) {
				// Get the node this packet is for - this will create a new node if it doesn't exist
				GetNode(data, callback);
			},
			function(node, callback) {
				// Update the FeedValue for the specified feed for each channel
				i = 0;
				data.values.forEach(function(value) 
				{
					var feedname = node.sensors[i].feedname;
					var divider = node.sensors[i].divider;
					var units = node.sensors[i].units;
					
					// If a feed has been specified for this channel
					if (feedname != null && feedname != "") 
					{
						// Update feed values
						UpdateFeedValues(feedname, value, divider, units, node, callback);						
						i++;
					}
				});
				
				callback(null, 'DONE STORING PACKET');
			}
		], function(err, result) {
			if (err) throw err;
			console.log('StorePacket: ' + result);
		});
	}
};