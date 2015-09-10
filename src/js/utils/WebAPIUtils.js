var request = require('superagent');

var ServerActions = require('../actions/ServerActions')

module.exports = {

    login: function(username, password){
        request.post( "sessions/create" )
        .set('Accept', 'application/json')
        .send({username: username, password: password})
        .end(function(error, res){
            if (res) {
                // ServerActions.receiveUser(JSON.parse(res.text));
                // // FIXME: Router.transitionTo to doesn't seem to work
                // // This redirect is a short term hack...
                // // Router.transitionTo('dashboard');
                // window.location.assign("/#/ui/dashboard");
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