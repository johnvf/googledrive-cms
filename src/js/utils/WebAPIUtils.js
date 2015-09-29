var request = require('superagent');
var ServerActions = require('../actions/ServerActions')


module.exports = {

    login: function( username, password, cb){
        request.post( "/auth/login" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(error, res){
            if (res) {
                // ServerActions.loggedIn( res.text );
                // window.location.assign("/projects/landing");
                var cb_res = {
                    authenticated: true,
                    token: res.text
                }
                cb(cb_res);
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
          .end(function(error, res){
            if (res) {
              response = JSON.parse(res.text)
              if( response.success == false ){
                alert("Unable to load project data. Authentication may have expired. Please logout & back in");
              }
              else{
                ServerActions.receiveProjects(JSON.parse(res.text));
              }
            }
          });
    },

    getReport: function(folder_id, project_id){
        request.get( "/api/project/" + folder_id + "/" + project_id )
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.token)
          .end(function(error, res){
            if (res) {
              response = JSON.parse(res.text)
              if( response.success == false ){
                alert("Unable to load project data. Authentication may have expired. Please logout & back in");
              }
              else{
                ServerActions.receiveReport(JSON.parse(res.text));
              }
            }
          });
    }
};