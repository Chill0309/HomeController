var socket = io.connect('http://10.0.0.31/');
socket.on('serialdata', function (data) {
    //var html = '<p>' + data.message + '</p>';
    //document.getElementById('output').innerHTML += html;
    //socket.emit('echo', { back: 'reply' });
	
	if ($('#node' + data.nodeId).length <= 0)
	{
		var newDiv = "<div id='node" + data.nodeId + "'>" + data.message + "</div>";
		$('#output').append(newDiv);
	} else {
		$('#node' + data.nodeId).html(data.message);
	}	
});
