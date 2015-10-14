var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    source = require('shell-source'),
    path = require('path');

function errorHandler(err, req, res, next) {
    console.log("handling error")
    console.error( JSON.stringify(err.stack) )
    if (res.headersSent) {
        return next(err);
    }
    res.status(304);
    res.send( { error: err } );
}

function setupServer() {
    // Set up the app
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Init routes
    require("./modules/routes")(app);

    /*
     * Static Stuff
     */

    // Longterm, some kind of generic URL rewrite may be needed for static files...

    // app.use('*', function(req, res, next) {
    //     req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, "/$1.$2");
    //     console.log(req.url)
    //     next();
    // });
    
    // For now, just re-writing the key files
    app.get("*/App.js", function(req, res, next) { 
        // if (err) { return next(err); }
        req.url = '/js/App.js'; next(); 
    });
    app.get("*/styles.css", function(req, res, next) { 
        req.url = '/css/styles.css'; next(); 
    });
    
    app.use( express['static']( __dirname + '/dist' ));
    app.get("*", function(req, res, next) {
        res.sendFile( __dirname + '/dist/index.html');
    });

    app.use(errorHandler);

    app.listen( process.env['PORT'] || 5000, function () {
      var port = process.env['PORT']
      console.log('Example app listening at http://localhost:%s', port);
    });
}

setupServer();