function GetTimeAgo(isoTimeString)
{
	var now = new Date();
	var nowTicks = Date.parse(now);
	var dateTicks = Date.parse(isoTimeString);
	var diff = Math.floor((nowTicks - dateTicks) / 1000);
	
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

var socket = io.connect('http://10.0.0.41/');

socket.on('tobrowser', function (data) {
	switch (data.message)
	{
		case 'sensornodeadded':
			location.reload();			
			break;
		case 'sensornodeupdated':
			var date = new Date(data.item.lastseen);
			var element = "#lastseen" + data.item.id;
			$(element).attr('isotime', date.toISOString());
			$(element).html(GetTimeAgo(date));
			
			data.item.sensors.forEach(function(sensor) {
				element = "#sensorvalues" + data.item.id + "_" + sensor.channelindex;
				var value = sensor.lastvalue / sensor.divider;
				$(element).html(value);
			});
			
			break;
		case 'channelfeedupdated':
			var date = new Date(data.item.lastupdated);
			var element = "#lastupdated" + data.item.id;
			$(element).attr('isotime', date.toISOString());
			$(element).html(GetTimeAgo(date));
			
			element = "#feedvalues" + data.item.id;
			var value = data.item.lastvalue + ' ' + data.item.units;
			$(element).html(value);
			break;
	}
});

function updateTimes()
{
	$(".datecell").each(function( index ) {
		$(this).html(GetTimeAgo($(this).attr('isotime')));
	});
	
	setTimeout(updateTimes, 2000);
}

$(document).ready(function() {
	// Update the last updated times
	updateTimes();

	// Hide all groups by defaut
	$(".feedgroupcontent").hide();

	// Setup a click handler for the group headers
	$(".feedgroupheader").click(function() {
		var group = $(this).attr('group');
		var element = '#feedgroup_' + group;
		$(element).slideToggle();
	});
});