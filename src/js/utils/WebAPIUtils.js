var request = require('superagent');
var ServerActions = require('../actions/ServerActions')


module.exports = {

    logIn: function( username, password){
        request.post( "/auth/login" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(error, res){
            if (res) {
                ServerActions.loggedIn( res.text );
                window.location.assign("/projects/landing");
            }
        });
    },

    logOut: function( ){
        localStorage.jwt = null;
        // At some point, this might require an API call.
        // It IS going to require a redirect soon
        ServerActions.loggedOut();
        window.location.assign("/projects/login");
    },

    getProject: function(projectName){
        request.get( "/api/project" )
          .set('Accept', 'application/json')
          .set('x-access-token', localStorage.jwt)
          .end(function(error, res){
            if (res) {
              ServerActions.receiveProject(JSON.parse(res.text));
            }
          });
    }

};