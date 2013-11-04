var SerialPort = require("serialport").SerialPort
var event = require('./event');
var dataprocessor = require('../controllers/dataprocessor.js');

module.exports = {
	start : function() {
		console.log("OPENING SERIALPORT CONNECTION");

		// Open the serialport to listen for data on
		var serialPort = new SerialPort("/dev/ttyAMA0", {
			baudrate: 9600,
			parser: require('./../node_modules/serialport/serialport.js').parsers.readline("\n")
		});

		// When a new packet of data arrives
		serialPort.on('data', function(data) {
			var messageSections = data.split(':');
			if (messageSections.length == 2)
			{
				// Parse packet data
				var nodeId = messageSections[0].trim();
				var messageBytes = messageSections[1].trim().split(' ');
				var messageValues = [];
				var message = "Node " + nodeId + ": ";
				for (var i=0; i<(messageBytes.length / 2); i++)
				{
					var msb = parseInt(messageBytes[i*2]);
					var lsb = parseInt(messageBytes[(i*2) + 1]);
					messageValues[i] = (msb<<8) + lsb;
                                        if ((messageValues[i] & 0x8000) > 0) {
                                                messageValues[i] = -(messageValues[i] & 0x7FFF);
                                        }
					message += messageValues[i] + ", ";
				}

				// Send the new data to the client
				console.log('RX << ' + data);
				event.emit('serialdatarx', { nodeId: nodeId, values: messageValues, message: message });
				
				// Store the new packet
				dataprocessor.storepacket({ nodeId: nodeId, values: messageValues, message: message });
			}
		});
	}
};
