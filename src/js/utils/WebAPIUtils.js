var request = require('superagent');
var ServerActions = require('../actions/ServerActions')

function handleError( errText ){

  switch(errText) {

    case "No token provided":
      alert('No token. Please logout, then login again.');
      break;

    default:
      alert('Oh no! error ' + errText);
      // do nothing
  }
  
}

module.exports = {

    login: function( username, password, cb){
        request.post( "/auth/login" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(err, res){
          if (err == null) {
            var cb_res = {
                authenticated: true,
                token: res.text
            }
            cb(cb_res);
          } else {
            handleError(res.text);
          }
        });
    },

    logout: function( ){
        // localStorage.token = null;
        // At some point, this might require an API call.
        // It IS going to require a redirect soon
        ServerActions.loggedOut();
        window.location.assign("/projects/login");
    },

    getProjects: function(){
        request.get( "/api/project" )
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.token)
          .end(function(err, res){

          if (err == null) {
            ServerActions.receiveProjects(JSON.parse(res.text)); 
          } else {
            handleError(res.text);
          }

        });
    },

    getReport: function(project_id, report_id){
        request.get( "/api/project/" + project_id + "/" + report_id )
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.token)
          .end(function(err, res){
            if (err == null) {
              ServerActions.receiveReport( report_id, JSON.parse(res.text));
            } else {
              handleError(res.text);
            }
          });
    },

    getReportLayouts: function(project_id, report_id){
        request.get( "/api/project/" + project_id + "/" + report_id + "/layout" )
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.token)
          .end(function(err, res){
            if (err == null) {
              ServerActions.receiveReportLayouts( report_id , JSON.parse(res.text));
            } else {
              handleError(res.text);
            }
          });
    },

    saveReportLayouts: function(project_id, report_id, layout){
        request.put( "/api/project/" + project_id + "/" + report_id + "/layout")
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.token)
          .send(layout)
          .end(function(err, res){
            if (err == null) {
              console.log("Saved.")
            } else {
              handleError(res.text);
            }
          });
    }
};