var request = require('superagent');

var ServerActions = require('../actions/ServerActions')

var jwt = null;

module.exports = {

    login: function( username, password){
        request.post( "/auth/login" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(error, res){
            if (res) {
                localStorage.jwt = res.text;
                ServerActions.loggedIn( res.text );
                window.location.assign("/projects/landing");
            }
        });
    },

    logout: function( ){
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