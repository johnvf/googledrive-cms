var path = require('path');
var driveClient = require('./drive-client');
// var stormpathClient = require('./stormpath-client')

module.exports = function (app, stormpath) {

    app.get('/data', function(req, res) {

        // driveClient.load( function(data){ 
        //     res.send(data);
        // });
      
    });

    app.get("/*", stormpath.loginRequired, function(req, res, next){
      res.sendFile(process.env.STATICROOT+'/index.html');
    });
    
    app.get("/login", function(req, res, next){
        console.log("login attempt")
        res.sendFile(process.env.STATICROOT+'/index.html');
    });
};