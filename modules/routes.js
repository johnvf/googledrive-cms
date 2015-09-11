var path = require('path');
var driveClient = require('./drive-client');
var stormpathClient = require('./stormpath-client')

module.exports = function (app) {


    // Login Route
    app.post("/auth/login", function(req, res, next){
        stormpathClient.getToken( req.body.username, req.body.password, function(jwt){
            res.send(jwt)
        })
    });

    // Route middleware to verify a token
    app.use(function(req, res, next) {

      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];

      // decode token
      if (token) {
        stormpathClient.verifyToken(req, res, next, token)
      } else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
        
      }
    });

    // Gets project data
    app.get('/api/project', function(req, res) {
        driveClient.load( function(data){ 
            res.send(data);
        });
    });

    // Gets a specific project report

    // Gets a report resource
};