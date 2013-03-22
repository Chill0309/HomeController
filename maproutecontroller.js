exports.mapRoute = function(app, prefix) {
	prefix = '/' + prefix;
	var prefixObj = require('./controllers/' + prefix);

	// Index
	app.get(prefix, prefixObj.index);

	// Add
	app.get(prefix + '/new', prefixObj.displaynew);

	// Show
	app.get(prefix + '/:sn', prefixObj.show);

	// Create
	app.post(prefix + '/create', prefixObj.create);

	// Edit
	app.get(prefix + '/:sn/edit', prefixObj.edit);

	// Update
	app.put(prefix + '/:sn', prefixObj.update);

	// Destroy
	app.del(prefix + '/:sn', prefixObj.destroy);


	// Edit
	app.get(prefix + '/:sn/edit/:propertyName/:propertySn', prefixObj.editProperty);

	// Update
	app.put(prefix + '/:sn/:propertyName/:propertySn', prefixObj.updateProperty);

};