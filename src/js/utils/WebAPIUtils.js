var request = require('superagent');

var ServerActions = require('../actions/ServerActions')

module.exports = {

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