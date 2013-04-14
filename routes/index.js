var SensorNode = require('../models/node.js');

exports.index = function(req, res){
	SensorNode.find({}).sort('rfgroup rfnodeid').lean().execFind(function(err, docs) {
		if (err) {
			res.send('Error displaying list of SensorNodes');
		} else {
			res.render('index', { title: 'Home Controller', items : docs, nodecount : docs.length } );
		}
	});
};
