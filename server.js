var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	source = require('shell-source'),
	path = require('path');

function setupServer(){
	// Set up the app
	var app = express();
	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

	// Init routes
	app.use('/', express.static(process.env.STATICROOT));
	require("./modules/routes")(app);
	app.listen(process.env.PORT);
}

source( __dirname + "/env.sh" , function(err) {
  if (err) return console.error(err);
  setupServer();
});