//var redis = require('redis')
var async = require('async')
var Widget = require('../models/widget');

var widgets = [
  {
    id : 1,
    name : "Widget 1",
    price : 1000.00
  },
  {
    id : 2,
    name : "Widget 2",
    price : 123.33
  }
]


//var client = redis.createClient();
//client.select(1);

/*
function makeCallbackFunc(member) {
  return function(callback) {
    client.hgetall(member, function(err, obj) {
      callback(err, obj);
    });
  };
}
*/

// Index listing
exports.index = function(req, res) {
  /*
  client.keys("*", function(err, result) {
    var data;
    
    if (err) {
      console.log(err);
    } else {
      console.log("Results: ");
      console.log(result.length);

      var callbackFunctions = new Array();
      for (var i=0; i<result.length; i++) {
        callbackFunctions.push(makeCallbackFunc(result[i]));
      }
      
      async.series(callbackFunctions, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render('widgets/index', { title: 'Widgets', widgets : result });
        }
      });
    }
  });
  */

  Widget.find({}, function(err, docs) {
    if (err) {
      res.send('Error displaying list of widgets');
    } else {
      console.log(docs);
      res.render('widgets/index', { title: 'Widgets', widgets : docs });
    }
  });
};

// Display new widgets form
exports.displaynew = function(req, res) {
  //var filePath = require('path').normalize(__dirname + "/../public/widgets/new.html");
  //res.sendfile(filePath);
  
  res.render('widgets/add', { title: 'Add Widget' });
};

// Add a widget
exports.create = function(req, res) {
  /*
  var index = widgets.length + 1;
  widgets[widgets.length] = {
    id : index,
    name : req.body.widgetname, 
    price : parseFloat(req.body.widgetprice),
    desc : req.body.widgetdesc
  };

  client.hset(index, "name", req.body.widgetname);
  client.hset(index, "price", req.body.widgetprice);
  client.hset(index, "desc", req.body.widgetdesc);

  //client.zadd("names", req.body.widgetname, index);

  console.log(widgets[index - 1]);
  res.render('widgets/added', { title: 'Widget Added', widget : widgets[index - 1] });
  */


  var widget = {
    sn : req.body.widgetsn,
    name : req.body.widgetname,
    price : parseFloat(req.body.widgetprice),
    desc : req.body.widgetdesc
  };

  var widgetObj = new Widget(widget);

  widgetObj.save(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      console.log(data);
      res.render('widgets/added', { title: 'Widget Added', widget: widget });
    }
  });
};

// Show a widget
exports.show = function(req, res) {
  /*
  var index = parseInt(req.params.id) - 1;
  if (!widgets[index])
    res.send('There is no widget with id ' + index);
  else
    res.render('widgets/show', { title: 'Show Widget', widget : widgets[index] });
  */

  var sn = req.params.sn;
  Widget.findOne({sn : sn}, function(err, doc) {
    if (err) {
      res.send('There is no widget with a sn of ' + sn);
    } else {
      res.render('widgets/show', { title: 'Show Widget', widget: doc }); 
    }
  });
};

// Delete a widget
exports.destroy = function(req, res) {
  /*
  var index = req.params.id - 1;
  delete widgets[index];
  console.log('deleted ' + req.params.id);
  res.send('deleted ' + req.params.id);
  */

  var sn = req.params.sn;

  Widget.remove({sn : sn}, function(err) {
    if (err) {
      res.send('There is no widget with a sn of ' + sn);
    } else {
      res.send('deleted ' + req.params.sn);
    }
  });
};

// Display edit form
exports.edit = function(req, res) {
  /*
  var index = parseInt(req.params.id) - 1;
  res.render('widgets/edit', { title: 'Edit Widget', widget : widgets[index] });
  */

  var sn = req.params.sn;
  Widget.findOne({sn : sn}, function(err, doc) {
    console.log(doc);
    if (err) {
      res.send('There is no widget with a sn of ' + sn);
    } else {
      res.render('widgets/edit', { title: 'Edit Widget', widget : doc });
    }
  });
};

// Update a widget
exports.update = function(req, res) {
  /*
  var index = parseInt(req.params.id) - 1;
  widgets[index] = 
  {
    id : index + 1,
    name : req.body.widgetname,
    price : parseFloat(req.body.widgetprice),
    desc : req.body.widgetdesc
  }
  console.log(widgets[index]);
  res.render('widgets/added', { title: 'Widget Edited', widget : widgets[index] });
  */

  var sn = req.params.sn;
  var widget = {
    sn : req.body.widgetsn,
    name : req.body.widgetname,
    price : parseFloat(req.body.widgetprice),
    desc : req.body.widgetdesc
  };

  Widget.update({sn : sn}, widget, function(err) {
    if (err) {
      res.send('Error updating widget: ' + err);
    } else {
      	res.render('widgets/added', { title: 'Widget Edited', widget : widget });
    }
  });
};

