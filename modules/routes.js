var path = require('path');
var driveClient = require('./drive-client');
var stormpathClient = require('./stormpath-client')

module.exports = function(app) {


  // Login Route
  app.post("/auth/login", function(req, res, next) {
    console.log(req.body);
    stormpathClient.getToken(req.body.username, req.body.password, function(jwt) {
      res.send(jwt)
    })
  });

  // Route middleware to verify a token
  app.use('/api/*', function(req, res, next) {

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

  app.get('/api/checkauth', function(req,res){
    res.status(200).send({
        success: true,
        message: 'Token verified.'
      });
  });
  
  // Gets all available projects
  app.get('/api/project', function(req, res) {
    driveClient.getProjectList(function(data) {
      res.send(data);
    });
  });

  // Gets specific project report data
  app.get('/api/project/:folder_id/:report_id', function(req, res) {
    driveClient.getProjectData( req.params.folder_id, req.params.report_id, function(data) {
      res.send(data);
    });
  });

};