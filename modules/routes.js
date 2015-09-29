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
  
  // Gets all available projects
  app.get('/api/project', function(req, res) {
    driveClient.getProjects(function(data) {
      res.send(data);
    });
  });
  

  // Gets specific project report data
  app.get('/api/project/:folder_id/:report_id', function(req, res) {
    driveClient.getReport( req.params.folder_id, req.params.report_id, function(data) {
      res.send(data);
    });
  });

  // Gets specific project report layout
  app.get('/api/project/:folder_id/:report_id/layout', function(req, res) {
    driveClient.getReportLayout( req.params.folder_id, req.params.report_id, function(data) {
      res.send(data);
    });
  });

  // Saves the specific project report layout
  app.put('/api/project/:folder_id/:report_id/layout', function(req, res) {
    driveClient.saveReportLayout( req.params.folder_id, req.params.report_id, req.body, function(success) {
      if( success ){
        return res.status(200).send({
          success: true,
          message: 'Layout saved.'
        });
      } else {
        return res.status(500).send({
          success: false,
          message: 'Layout not saved.'
        });
      }
    });
  });

};