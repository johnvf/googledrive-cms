var path = require('path');
var driveClient = require('./drive-client');
var stormpathClient = require('./stormpath-client');

function get_user_project_access(req){
    if( req.decoded ){
      var projects = req.decoded.body.scope
      return projects
    }
    else {
      console.log("No projects attribute found for this user.")
      return []
    }
}

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
    var projects_allowed = get_user_project_access(req)
    driveClient.getProjects( projects_allowed, function(data) {
      res.send(data);
    });
  });
  

  // Gets specific project report data
  app.get('/api/project/:project_id/:report_id', function(req, res) {
    var projects_allowed = get_user_project_access(req)
    driveClient.getReport( projects_allowed, req.params.project_id, req.params.report_id, function(data) {
      res.send(data);
    });
  });

  // Gets specific project report layout
  app.get('/api/project/:project_id/:report_id/layout', function(req, res) {
    driveClient.getReportLayout( req.params.project_id, req.params.report_id, function(data) {
      res.send(data);
    });
  });

  // Saves the specific project report layout
  app.put('/api/project/:project_id/:report_id/layout', function(req, res) {
    driveClient.saveReportLayout( req.params.project_id, req.params.report_id, req.body, function(success) {
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