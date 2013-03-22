var async = require('async')
var SensorNode = require('../models/sensornode');

// Index listing
exports.index = function(req, res) {
  SensorNode.find({}).sort('rfgroup rfnodeid').lean().execFind(function(err, docs) {
    if (err) {
      res.send('Error displaying list of SensorNodes');
    } else {
      res.render('sensornodes/index', { title: 'SensorNodes', items : docs, nodecount : docs.length });
    }
  });
};

// Display new form
exports.displaynew = function(req, res) {
  res.render('sensornodes/add', { title: 'Add SensorNode' });
};

// Add a SensorNode
exports.create = function(req, res) {
	var item = {
		rfgroup: parseInt(req.body.rfgroup),
		rfnodeid: parseInt(req.body.rfnodeid),
		location: req.body.location,
		packetversion: parseInt(req.body.packetversion),
		pcb: req.body.pcb,
		firmware: req.body.firmware,
		sensors: req.body.sensors,
		updateInterval: parseInt(req.body.updateInterval)
	};

	var obj = new SensorNode(item);
	obj.save(function (err, data) {
		if (err) {
			res.send(err);
		} else {
			console.log(data);
			res.render('sensornodes/added', { title: 'SensorNode Added', item: item });
		}
	});
};

// Show a SensorNode
exports.show = function(req, res) {
  var id = req.params.sn;
  SensorNode.findOne({_id : id}, function(err, doc) {
    if (err || doc == null) {
      res.send('There is no SensorNode with a id of ' + id);
    } else {
      res.render('sensornodes/show', { title: 'Show SensorNode', item: doc }); 
    }
  });
};

// Delete a SensorNode
exports.destroy = function(req, res) {
  var id = req.params.sn;
  SensorNode.remove({_id : id}, function(err) {
    if (err) {
      res.send('There is no SensorNode with a id of ' + id);
    } else {
      //res.send('deleted ' + id);
	  SensorNode.find({}).sort('rfgroup rfnodeid').lean().execFind(function(err, docs) {
		if (err) {
		  res.send('Error displaying list of SensorNodes');
		} else {
		  console.log(docs);
		  res.render('sensornodes/index', { title: 'SensorNodes', items : docs, nodecount : docs.length });
		}
	  });
    }
  });
};

// Display edit form
exports.edit = function(req, res) {
  var id = req.params.sn;
  SensorNode.findOne({_id : id}, function(err, doc) {
    console.log(doc);
    if (err || doc == null) {
      res.send('There is no SensorNode with a id of ' + id);
    } else {
      res.render('sensornodes/edit', { title: 'Edit SensorNode', item : doc });
    }
  });
};

// Update a SensorNode
exports.update = function(req, res) {
  var id = req.params.sn;
  var item = {
    rfgroup: parseInt(req.body.rfgroup),
    rfnodeid: parseInt(req.body.rfnodeid),
    location: req.body.location,
    packetversion: parseInt(req.body.packetversion),
    pcb: req.body.pcb,
    firmware: req.body.firmware,
    updateInterval: parseInt(req.body.updateInterval)
  };

  SensorNode.update({_id : id}, item, function(err) {
    if (err) {
      res.send('Error updating SensorNode: ' + err);
    } else {
      	res.render('sensornodes/added', { title: 'SensorNode Edited', item : item });
    }
  });
};

// Display the edit form for a property
exports.editProperty = function(req, res) {
	var id = req.params.sn;
  	var propertyName = req.params.propertyName;
  	var propertySn = req.params.propertySn;
  	console.log("Editting sensornode property: " + propertyName + " : " + propertySn);
  	 
  	SensorNode.findOne({_id : id}, function(err, item) {
    	if (err || item == null) {
     		res.send('There is no SensorNode with a id of ' + id);
    	} else {
    		var propertyItem = item[propertyName][propertySn];
    	  	res.render('sensornodes/edit_' + propertyName, { 
    	  		title: 'Edit ' + propertyName, 
    	  		item : item, 
    	  		property : propertyItem
    	  	});
    	}
  	});
};

// Update a property of a SensorNode
exports.updateProperty = function(req, res) {
	var id = req.params.sn;
	var propertyName = req.params.propertyName;
  	var propertySn = parseInt(req.params.propertySn);

  	SensorNode.findOne({_id : id}, function(err, item) {
    	if (err || item == null) {
     		res.send('There is no SensorNode with a id of ' + id);
    	} else {
    		var updatedProperty = item[propertyName];
    		
    		// TODO: GET SPECIFIC PROPERTIES FROM BODY COLLECTION SO WE DONT NEED TO MANUALLY SPECIFY THEM!!
    		console.log("Setting name of " + propertySn + " to " + req.body.name);
    		updatedProperty[propertySn].name = req.body.name;
			updatedProperty[propertySn].units = req.body.units;
			updatedProperty[propertySn].divider = parseInt(req.body.divider);
			
			console.log(updatedProperty);
			console.log(updatedProperty[propertySn]);
			
			// TODO: REMOVE STATIC SENSORS PROPERTY
			SensorNode.update({_id : id}, {sensors : updatedProperty}, function(err) {
				if (err) {
					res.send('Error updating SensorNode: ' + err);
				} else {
					SensorNode.find({}).sort('rfgroup rfnodeid').lean().execFind(function(err, docs) {
						if (err) {
							res.send('Error displaying list of SensorNodes');
						} else {
							console.log("Sensor node property (" + propertyName + ") updated ok");
							res.render('sensornodes/index', { title: 'SensorNodes', items : docs, nodecount : docs.length });
						}
					});
				}
			});	
    	}
  	});  	
};
