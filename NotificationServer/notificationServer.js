// const express = require('express')
var app = require('express')();
var http = require('http').Server(app);

var server = app.listen(8085, function () {
	console.log('Example app listening on port 8085! with cors')
})

const io = require('socket.io')(server);
const cors = require('cors')


app.use(function (req, res, next) {

	// Set the CORS headers
	res.setHeader('Access-Control-Allow-Origin', 'http://172.17.0.5');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Allow transmission of cookies
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});






app.get('/', function (req, res) {
	res.send('Hello World! test');
})

app.get('/msg/:msg', function (req, res) {
	io.emit('notification', req.params.msg);
	res.send('SENT: ' + req.params.msg + ' and: ' + io.engine.clientsCount);
	// console.log('SENT: ' + req.params.msg);

})

app.get('/name2/:name', function (req, res) {
	console.log('served!');

	res.send('Hello, ' + req.params.name +'! test');
})


// Socket IO
io.on('connection', function(socket){
	console.log('a user connected');


	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

});


setTimeout(function() {  
	// io.emit('broadcast', 'This is a message');
	// io.emit('notification', 'This is a message 2');

}, 5000);
