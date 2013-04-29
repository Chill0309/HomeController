var SensorNode = require('../models/node.js');

var nodes = new SensorNode();

exports.index = function(req, res){
	nodes.find('all', {}, function(err, rows, fields) {
		if (err) {
			res.send('Error displaying list of SensorNodes');
		} else {
			res.render('index', { title: 'Home Controller', items : rows, nodecount : rows.length } );
		}
	});
};
