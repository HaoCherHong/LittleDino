/*
LittleDino node.js Server by LangChuan Huang
2015-06-13 Hackathon Taiwan
Send http get request to http://127.0.0.1:81/blinkLED with URL parameter "LED"(A B C) and "time"(millisecond)
example: http://127.0.0.1:81/blinkLED?LED=A&time=500
*/

var http = require('http');
var express = require('express');
var app = express();
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("COM3", {
  baudrate: 9600
});
serialPort.on("open", function () {
  console.log('open serial port');
})

app.get('/blinkLED', function (request, response) {
	var LED = request.query.LED;
	var time = request.query.time;
	serialPort.write(LED + time + 'Z', function(err, results) {
		if(err) console.log('err ' + err);
		else {
			console.log('results ' + results);
			response.end('Blink LED ' + LED);
		}
	});
});
var server = http.createServer(app);
server.listen(81, function () {
});