// Connect to Socket.IO
var socket = io.connect('http://redPi/');
var _data;
var _chart;
var _lastRedrawTime;

function GetTimeAgo(isoTimeString, timeOffset)
{
	var now = new Date();
	var nowTicks = Date.parse(now);
	var dateTicks = Date.parse(isoTimeString);
	var diff = Math.floor(((nowTicks - dateTicks) / 1000) + (timeOffset / 1000));
	
	var value = "<font color='";
	if (diff < 30) { value += "green"; }
	else if (diff < 90)	{ value += "orange"; }
	else { value += "red"; }
	value += "'>";
	
	var time = "";
	var units = "";
	if (diff < 120)	{ time = diff; units = "second"; }
	else if (diff < (60*60)) { time = Math.round(diff / 60); units = "minute"; }
	else if (diff < (60*60*24)) { time = Math.round(diff / 3600); units = "hour"; }
	else { time = Math.round(diff / 86400); units = "day"; }
	value += time;
	value += " " + units;
	if (time > 1) { value += "s"; }
	value += " ago";
	
	value += "</font>";
	return value;
}

// When chart data is received
socket.on('graphdata', function(data) {
	// If this is the data for the feed we have asked for
	if (data.feedid == $('#feedinfo').attr('feedid'))
	{
		// Add a new graph
		nv.addGraph(function() {
		  var chart = nv.models.lineWithFocusChart();
		  
		  chart.xAxis
			.rotateLabels(-45)
			.tickFormat(function(xValue) { return d3.time.format('%b %d %H:%M:%S')(new Date(xValue)); });
			
		  chart.x2Axis.tickFormat(function(x) { return ""; }); 
		  chart.yAxis.axisLabel('Value').tickFormat(d3.format(',.f'));
		  chart.y2Axis.tickFormat(d3.format(',.f'));

		  d3.select('#chart svg')
			  .datum(data.data)
			  .transition().duration(500)
			  .call(chart);

		  nv.utils.windowResize(chart.update);

		  _data = data.data;
		  _chart = chart;
		  _lastRedrawTime = new Date();
		  
		  return chart;
		});
	}
});

// When chart data is received
socket.on('summarygraphdata', function(data) {
	// If this is the data for the feed we have asked for
	if (data.feedid == $('#feedinfo').attr('feedid'))
	{
		// Add a new graph
		nv.addGraph(function() {
		  var chart = nv.models.lineChart();
		  
		  chart.xAxis
			.rotateLabels(-45)
			.tickFormat(function(xValue) { return d3.time.format('%b %d')(new Date(xValue)); });

			chart.yAxis.tickFormat(d3.format(',.f'));
		  
		  d3.select('#summarychart svg')
			  .datum(data.data)
			  .transition().duration(500)
			  .call(chart);

		  nv.utils.windowResize(chart.update);

		  return chart;
		});
	}
});

// Redraw the graph
function redraw() {
	d3.select('#chart svg')
		.datum(_data)
		.transition().duration(500)
		.call(_chart);
}

// If we receive a socket.io message named 'tobrowser'
socket.on('tobrowser', function (data) {
	switch (data.message)
	{
		// If a channel feed has been updated
		case 'channelfeedupdated':
			// If this new value is for the currently displayed feed
			if (data.item.id == $('#feedinfo').attr('feedid'))
			{
				// Work out the exact time the value is for and apply a timeoffset to correct for time
				// differences between the server and the client
				var date = new Date(data.item.lastupdated);
				var timeOffset = date - new Date();
				$("#lastupdated").attr('timeoffset', timeOffset);
				$("#lastupdated").attr('isotime', date.toISOString());
				$("#lastupdated").html(GetTimeAgo(date, timeOffset));
				
				// Set the current value text
				var value = data.item.lastvalue + ' ' + data.item.units;
				$("#lastvalue").html(value);
				
				// Add the new value to the graph and redraw it
				_data[0].values.push({ x: date, y: data.item.lastvalue});
				
				// If we have not drawn for a minute
				var timeSinceRedraw = (new Date()) - _lastRedrawTime;
				if (timeSinceRedraw > 60000)
				{
					redraw();
					_lastRedrawTime = new Date();
				}
			}
			break;
	}
});

function updateTimes()
{
	$(".datecell").each(function( index ) {
		$(this).html(GetTimeAgo($(this).attr('isotime'), $(this).attr('timeoffset')));
	});
	
	setTimeout(updateTimes, 2000);
}

$(document).ready(function() {
	// Send a request straight away for chart data
	socket.emit('graphdatarequest', { feedid : $('#feedinfo').attr('feedid') });
	
	// Update the last updated times
	updateTimes();
});