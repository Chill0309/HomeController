var event = require('../classes/event.js');
var SensorNode = require('../models/sensornode.js');
var NodeChannel = require('../models/nodechannel.js');
var ChannelFeed = require('../models/channelfeed.js');
var FeedValue = require('../models/feedvalue.js');

function SaveSensorNode(item) {
	var obj = new SensorNode(item);
	obj.save(function (err, data) {
		if (err) {
			console.log("Error saving node: " + err);
		} else {
			console.log("Saved new node: " + data);
			event.emit('tobrowser', { message: 'sensornodeadded', nodeId: data.nodeId });
		}
	});
};

function UpdateSensorNode(item, sensors) {
	item.lastseen = new Date();
	event.emit('tobrowser', { message: 'sensornodeupdated', item: item });
	
	SensorNode.update({_id : item._id}, { lastseen : new Date(), sensors : sensors }, function(err) {
		if (err) {
			console.log("Error updating node: " + err);
		} else {
			console.log("Node updated: " + item.rfnodeid);
		}
	});
};

function SaveFeedValue(item) {
	var obj = new FeedValue(item);
	obj.save(function (err, data) {
		if (err) {
			console.log("Error saving feed value: " + err);
		} else {
			event.emit('tobrowser', { message: 'feedvalueadded', item: item });
		}
	});
};

module.exports = {
	// Stores a new received packet
	storepacket : function(data) {		
		// Lookup if node exists
		console.log("Storing packet for node " + data.nodeId);
		SensorNode.find({}).where("rfnodeid", data.nodeId).lean().execFind(function(err, nodes) {
			if (err) {
				res.send('Error getting list of SensorNodes');
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
					console.log("Saving node...");
					SaveSensorNode(newNode);
				} 
				else 
				{
					// TODO: Deal with new sensor values added once the node exists
					
					// Update sensor values
					var i = 0;
					data.values.forEach(function(value) 
					{
						nodes[0].sensors[i++].lastvalue = value;
					});
					
					// Save updates to node
					UpdateSensorNode(nodes[0], nodes[0].sensors);
					
					// Update the FeedValue for the specified feed for each channel
					i = 0;
					data.values.forEach(function(value) 
					{
						var feedname = nodes[0].sensors[i].feedname;
						var divider = nodes[0].sensors[i].divider;
						
						// If a feed has been specified for this channel
						if (feedname != null && feedname != "") 
						{
							// Get the feed
							ChannelFeed.find({}).where("name", feedname).execFind(function(err, feeds) 
							{
								if (err)
								{
									console.log("Error looking up feed " + feedname);
								}
								else
								{
									var feed = feeds[0];
									
									// Create a new feed value
									var feedvalue = {
										feedid : feed._id,
										value : (value / divider),
										timestamp : new Date()
									};
									
									// Save the feed value
									SaveFeedValue(feedvalue);
								}							
							});
							
							i++;
						}
					});
				}
			}
		});
	}
};