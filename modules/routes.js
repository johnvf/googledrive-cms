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
    stormpathClient.getUser(req.body.username, req.body.password, 
      function( user ) {
        res.send( user )
      },
      function(err){ 
        console.log("got here");
        next(err); 
      }
    );
  });

  // Route middleware to verify a token
  app.use('/api/*', function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    try{
      console.log("getting token")
      // decode token
      if (token) {
        stormpathClient.verifyToken(req, res, next, token)
      } else {
        throw "No token provided"
      }
    }
    catch( err ) {
      next(err)
    }

  });
  
  // Gets all available projects
  app.get('/api/project', function(req, res, next) {
    var projects_allowed = get_user_project_access(req)

    driveClient.getProjects( projects_allowed, 
      function(data) {
        res.send(data);
      }, 
      function(err){ next(err); }
    );

  });
  

  // Gets specific project report data
  app.get('/api/project/:project_id/:report_id', function(req, res, next) {
    var projects_allowed = get_user_project_access(req)

    driveClient.getReport( projects_allowed, req.params.project_id, req.params.report_id, 
      function(data) {
        res.send(data);
      }, 
      function(err){ next(err); }
    );

  });

  // Gets specific project report layout
  app.get('/api/project/:project_id/:report_id/layout', function(req, res, next) {

    driveClient.getReportLayout( req.params.project_id, req.params.report_id, 
      function(data) {
        res.send(data);
      }, 
      function(err){ next(err); }
    );

  });

  // Saves the specific project report layout
  app.put('/api/project/:project_id/:report_id/layout', function(req, res) {
    
    driveClient.saveReportLayout( req.params.project_id, req.params.report_id, req.body, 
      function(success) {
        return res.status(200).send({
          success: true,
          message: 'Layout saved.'
        });
      },
      function(err){ next(err); }
    );

  });

};