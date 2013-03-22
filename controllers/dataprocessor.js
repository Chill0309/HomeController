var event = require('../classes/event.js');
var SensorNode = require('../models/sensornode');
var NodeChannel = require('../models/nodechannel');

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
				} else {
					// TODO: Deal with new sensor values added once the node exists
					
					// Update sensor values
					var i = 0;
					data.values.forEach(function(value) {
						nodes[0].sensors[i++].lastvalue = value;
					});
					
					// Save updates to node
					UpdateSensorNode(nodes[0], nodes[0].sensors);
				}
				
				// Lookup all measurement values for this node
				
				// Loop through each measurement value
				
					// If the measurement value does not exist
					
						// Create the measurement value
						
					// Add measurement value data
					
			}
		});
	}
};