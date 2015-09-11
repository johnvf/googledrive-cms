var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	source = require('shell-source'),
	path = require('path'),
	stormpath = require('express-stormpath');

function setupServer(){
	// Set up the app
	var app = express();
	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

	app.use(stormpath.init(app, {
		application: {
		    href: process.env.STORMPATH_CLIENT_APPLICATION_HREF
		},
	  	web: {
  		    login: { 
  		    	enabled: true,
  		    	nextUri: '../landing'
  		    },
	        logout: { 
	        	enabled: true,
	        	nextUri: '../login'
	        },
		    spaRoot: process.env.STATICROOT+'/index.html'
	  	},
	  	website: true
	}));

	app.use(function(req, res, next) {
	  if ( req.user ) {
	    console.log('Current User:', req.user.username);
	  } else {
	    console.log('Unauthenticated');
	  }
	  next();
	});

	// Init routes
	app.use( express.static(process.env.STATICROOT));
	require("./modules/routes")(app, stormpath);


	app.on('stormpath.ready', function() {
		console.log("app.js serving on port:" + process.env.PORT)
		app.listen(process.env.PORT);
	});
}

source( __dirname + "/env.sh" , function(err) {
  if (err) return console.error(err);
  setupServer();
});