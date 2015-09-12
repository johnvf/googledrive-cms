var AppDispatcher = require('../dispatcher/AppDispatcher');

var WebAPIUtils = require('../utils/WebAPIUtils');

module.exports = {

  logIn: function(username, password) {
    WebAPIUtils.logIn( username, password )
    AppDispatcher.handleViewAction({
      type: "LOG_IN",
    });
  },

  logOut: function(res) {
    WebAPIUtils.logOut( );
    AppDispatcher.handleViewAction({
      type: "LOG_OUT"
    });
  },

  getProject: function(projectName){
    WebAPIUtils.getProject( projectName )
    AppDispatcher.handleViewAction({
      type: "LOAD_PROJECT"
    });
  }

};