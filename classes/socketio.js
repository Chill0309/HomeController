var socketio = require('socket.io');
var event = require('./event.js');

module.exports = {
	start : function(server) {
		// Start Socket.IO listening
		var io = socketio.listen(server);
		console.log("Socket.IO Listening...");

		// On a new connection event
		io.sockets.on('connection', function (socket) {
			// On a serial data packet received event
			event.on('serialdatarx', function(data) {
				// Send the data to the client
				console.log("Received serial packet from node " + data.nodeId + ", socket client " + socket.id);
				socket.emit('serialdata', data);
			});
			
			// Generic event that can be used to send a message to the client browser code 
			event.on('tobrowser', function(data) {
				socket.emit('tobrowser', data);
			});

			// On an echo request from a client
			socket.on('echo', function (data) {
				// Send the data back to the client
				socket.emit('echoreply', { packet: data.back });
			});
		});
	}
};