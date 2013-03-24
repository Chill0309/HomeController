var routes = require('./routes'); // Routes directory
var map = require('./maproutecontroller'); // Maproutecontoller template
var pages = require('./routes/pages.js'); // Routes directory

module.exports = function(app) {
	// Setup routes
	//app.get('/', function(req, res) { res.render('index', { title: 'House Monitor' } ); }); // Render page in-line
	app.get('/', routes.index); // Example accessing a file within a directory of routes
	
	// Define models that will be loaded using the maproutecontroller template
	var prefixes = ['sensornodes'];
	prefixes.forEach(function(prefix) {
		map.mapRoute(app, prefix);
	});
	
	// Channel Feeds
	app.get('/feeds', pages.feedlist);
	app.get('/feeds/:id', pages.showfeed);
};