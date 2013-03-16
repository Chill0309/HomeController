var async = require('async')
var SensorNode = require('../models/sensornode');

// Index listing
exports.index = function(req, res) {
  SensorNode.find({}).sort('rfgroup rfnodeid').execFind(function(err, docs) {
    if (err) {
      res.send('Error displaying list of SensorNodes');
    } else {
      console.log(docs);
      res.render('sensornodes/index', { title: 'SensorNodes', items : docs, nodecount : docs.length });
    }
  });
};

// Display new form
exports.displaynew = function(req, res) {
  res.render('sensornodes/add', { title: 'Add SensorNode' });
};

// Add a SensorNode
exports.create = function (req, res) {
    SensorNode.find({}).sort('-id').execFind(function (err, docs) {
        var nextId = 1;
        if (err) {
            console.log(err);
        } else {
            nextId = docs[0].id + 1;

            var item = {
                id: nextId,
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
        }
    });
};

// Show a SensorNode
exports.show = function(req, res) {
  var id = req.params.sn;
  SensorNode.findOne({id : id}, function(err, doc) {
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
  SensorNode.remove({id : id}, function(err) {
    if (err) {
      res.send('There is no SensorNode with a id of ' + id);
    } else {
      res.send('deleted ' + id);
    }
  });
};

// Display edit form
exports.edit = function(req, res) {
  var id = req.params.sn;
  SensorNode.findOne({id : id}, function(err, doc) {
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
    id: id,
    rfgroup: parseInt(req.body.rfgroup),
    rfnodeid: parseInt(req.body.rfnodeid),
    location: req.body.location,
    packetversion: parseInt(req.body.packetversion),
    pcb: req.body.pcb,
    firmware: req.body.firmware,
    sensors: req.body.sensors,
    updateInterval: parseInt(req.body.updateInterval)
  };

  SensorNode.update({id : id}, item, function(err) {
    if (err) {
      res.send('Error updating SensorNode: ' + err);
    } else {
      	res.render('sensornodes/added', { title: 'SensorNode Edited', item : item });
    }
  });
};

