var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	source = require('shell-source');


function setupServer(){
	// Set variables
	var port = process.env.PORT
	var staticRoot = process.env.STATICROOT

	// Set up the app
	var app = express();
	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

	// Init routes
	app.use("/", express.static( staticRoot ));

	var server = http.createServer(app).listen(port, function() {
		console.log('Server listening on port ' + port);
	});
}

source( __dirname + "/env.sh" , function(err) {
  if (err) return console.error(err);
  setupServer();
});