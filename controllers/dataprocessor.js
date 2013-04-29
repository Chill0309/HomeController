var event = require('../classes/event.js');
var async = require('async');
var SensorNode = require('../models/node.js');
var NodeChannel = require('../models/channel.js');
var ChannelFeed = require('../models/feed.js');
var FeedValue = require('../models/feedvalue.js');
var Database = require('../classes/database.js');

var nodes = new SensorNode();
var channels = new NodeChannel();
var feeds = new ChannelFeed();
var feedvalues = new FeedValue();

function GetNode(data, callback) {
	async.waterfall([
		function(callback) {
			if (Database.SensorNodeCollection['Node' + data.nodeId]) {
				//console.log("INFORMATION: Node " + data.nodeId + " exists in SensorNodeCollection");
				callback(null, Database.SensorNodeCollection['Node' + data.nodeId]);
			} else {
				//console.log("INFORMATION: Adding Node " + data.nodeId + " to SensorNodeCollection");
				nodes.find('all', {where: "rfnodeid = " + data.nodeId}, function(err, rows, fields) {
					if (err) {
						callback('Error getting list of SensorNodes: ' + err, null);
					} else {
						// If the node does not exist
						if (rows.length <= 0)
						{
							console.log("NodeId does not yet exist, creating it");
			
							// Create the node in the database
							var newNode = new SensorNode({
								rfnodeid: data.nodeId,
								location: "New Node",
								packetversion: 0,
								pcb: "Unknown",
								firmware: "Unknown",
								updateInterval: 0,
								lastseen: new Date()
							});

							// Save the new node object
							console.log('Saving sensornode');
							newNode.save(function (err, result) {
								if (err) {
									callback('Error saving node: ' + err, null);
								} else {
									console.log('New node saved:');
									console.log(result);
									
									// Locally store new node
									console.log('Storing sensornode locally');
									newNode.set('id', result.insertId);
									Database.SensorNodeCollection['Node' + data.nodeId] = newNode;
									
									var i = 0;
									data.values.forEach(function(value) {
										var channel = new NodeChannel({
											nodeid: newNode.id,
											channelindex : i++,
											name : "Channel " + i,
											units : "",
											divider : 100,
											lastvalue : value,
											feedname : ""
										});
										
										console.log("Saving channel " + i);
										channel.save(function(err,result) {
											if (err) {
												console.log("Error saving channel: " + err);
											}
										});
									});
									
									event.emit('tobrowser', { message: 'sensornodeadded', nodeId: data.nodeId });
									
									// Pass results to the next function in the sequence, err (arg1) = null
									callback(null, newNode);
								}
							});
						}
						else
						{
							var node = new SensorNode(rows[0]);
						
						 	// Store node in local array
							Database.SensorNodeCollection['Node' + data.nodeId] = node;
							
							// Raise callback, passing the node back
							callback(null, node);
						}
					}
				});
			}
		},
		function(node, callback) {
			// Set last seen in memory node
			Database.SensorNodeCollection['Node' + data.nodeId].attributes.lastseen = new Date();
		
			// Save updates to node
			node.attributes.lastseen = new Date();
			node.save(function(err, result) {
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

function GetNodeChannels(node, callback) {
	async.waterfall([
		function(callback) {
			channels.find('all', {where: "nodeid = " + node.id}, function(err, rows, fields) {
				if (err) {
					callback('Error getting list of Node Channels: ' + err, null);
				} else {
					callback(null, node, rows);
				}
			});
		}
	], function(err, node, channels) {
		if (err) throw err;
		callback(null, node, channels);
	});
}

function GetFeed(feedname, callback) {
	async.waterfall([
		function(callback) {
			feeds.find('all', {where: "name = '" + feedname + "'"}, function(err, rows, fields) {
				if (err) {
					callback('Error getting list of Feeds: ' + err, null);
				} else {
					if (rows.length > 0)
					{
						var feed = new ChannelFeed(rows[0]);
						callback(null, feed);
					} else {
						callback("Failed to find Feed: " + feedname, null);
					}
				}
			});
		}
	], function(err, feed) {
		if (err) throw err;
		callback(null, feed);
	});
}

function UpdateFeedValues(feedname, value, divider, units, node, callback) {
	async.waterfall([
		function(callback) {
			GetFeed(feedname, function(err, feed) {
				if (err)
				{
					callback("FAILED TO FIND FEED", null, null, null);
				} else {
					callback(null, feed, value, divider);
				}
			});
		},
		function (feed, value, divider, callback) {
			var newValue = (value / divider);
			var previousValue = Database.FeedValues['FeedValue' + feed.id];
			var createNewValue = 1;
			
			// If a previous feed value has been stored
			if (previousValue)
			{
				var previousValueMinRange = previousValue.attributes.value - feed.attributes.filter;
				var previousValueMaxRange = previousValue.attributes.value + feed.attributes.filter;
				
				// If this value is the same (or within the allowed filter size) of the previous
				if (newValue >= previousValueMinRange && newValue <= previousValueMaxRange)
				{
					// Keep the previous value
					previousValue.attributes.readingcount++;
					previousValue.attributes.timestampB = new Date();
					previousValue.save(function(err, result) {
						if (err) {
							callback('Error updating feed: ' + err, null);
						} else {
							Database.FeedValues['FeedValue' + feed.id].timestampB = new Date();
							event.emit('tobrowser', { message: 'feedvalueupdated', item: Database.FeedValues['FeedValue' + feed.id] });
						}
					});
					
					// We do not want to create a new feed value
					createNewValue = 0;
				}
			}
			
			if (createNewValue > 0) {
				// Create a new feed value
				var feedvalue = new FeedValue({
						feedid : feed.id,
						value : newValue,
						timestampA : new Date(),
						timestampB : new Date(),
						readingcount : 1
				});
				feedvalue.save(function (err, result) {
					if (err) {
						callback('Error saving feed value: ' + err, null);
					} else {
						feedvalue.set('id', result.insertId);
						Database.FeedValues['FeedValue' + feed.id] = feedvalue;
						event.emit('tobrowser', { message: 'feedvalueadded', item: feedvalue });
					}
				});
			}
			
			// Update the last value for the feed itself
			feed.attributes.lastvalue = newValue;
			feed.attributes.lastupdated = new Date();
			feed.attributes.units = units;
			event.emit('tobrowser', { message: 'channelfeedupdated', item: feed.attributes });		

			feed.save(function(err, result) {
				if (err) {
					callback('Error updating feed: ' + err, null);
				} else {
					callback(null, 'DONE');
				}
			});
		}
	], function(err, result) {
		if (err) throw err;
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
				// Get channels for this node
				GetNodeChannels(node, callback);
			},
			function(node, channels, callback) {
				// Update the FeedValue for the specified feed for each channel
				i = 0;
				data.values.forEach(function(value) 
				{
					var feedname = channels[i].feedname;
					var divider = channels[i].divider;
					var units = channels[i].units;
					
					//console.log("Channel " + i + " = " + (value / divider));
					i++;
											
					// If a feed has been specified for this channel
					if (feedname != null && feedname != "") 
					{
						// Update feed values
						UpdateFeedValues(feedname, value, divider, units, node, callback);						
					}					
				});
				
				callback(null, 'DONE STORING PACKET');
			}
		], function(err, result) {
			if (err) throw err;
			//console.log('StorePacket: ' + result);
		});
	}
};