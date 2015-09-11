var request = require('superagent');

var ServerActions = require('../actions/ServerActions')

module.exports = {

    login: function(username, password){
        request.post( "/login" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(error, res){
            if (res) {
                console.log(res)
                ServerActions.loggedIn( res );
                window.location.assign("/");
            }
        });
    },

    logout: function(){
        request.get( "/logout" )
        .set('Accept', 'application/json')
        .end(function(error, res){
            if (res) {
                console.log(res)
                ServerActions.loggedOut( res );
            }
        });
    },

    getProject: function(projectName){
        request.get( "/data" )
          .set('Accept', 'application/json')
          .end(function(error, res){
            if (res) {
              ServerActions.receiveProject(JSON.parse(res.text));
            }
          });
    }

};