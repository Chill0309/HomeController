var routes = require('./routes'); // Routes directory
var map = require('./maproutecontroller'); // Maproutecontoller template
var user = require('./routes/user.js'); // Specific route file

module.exports = function(app) {
	// Setup routes
	//app.get('/', function(req, res) { res.render('index', { title: 'House Monitor' } ); }); // Render page in-line
	app.get('/', routes.index); // Example accessing a file within a directory of routes
	app.get('/users', user.list); // Example of accessing an exported method in a file
	
	// Define models that will be loaded using the maproutecontroller template
	var prefixes = ['sensornodes'];
	prefixes.forEach(function(prefix) {
		map.mapRoute(app, prefix);
	});
};