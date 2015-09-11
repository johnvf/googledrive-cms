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
                jwt = res.text;
                localStorage.jwt = jwt;
                ServerActions.loggedIn( jwt );
                // window.location.assign("/");
            }
        });
    },

    logout: function( ){
        request.get( "/auth/logout" )
        .set('Accept', 'application/json')
        .set('x-access-token', localStorage.jwt)
        .end(function(error, res){
            if (res) {
                console.log(res)
                ServerActions.loggedOut( res );
            }
        });
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