var AppDispatcher = require('../dispatcher/AppDispatcher');

var WebAPIUtils = require('../utils/WebAPIUtils');

module.exports = {

  login: function(username, password, callback) {
    AppDispatcher.handleViewAction({
      type: "LOG_IN",
      username: username,
      password: password,
      callback: callback
    });
  },

  logout: function(res) {
    AppDispatcher.handleViewAction({
      type: "LOG_OUT"
    });
  },

  getProjects: function(){
    WebAPIUtils.getProjects( )
    AppDispatcher.handleViewAction({
      type: "GET_PROJECTS"
    });
  },

  getProjectData: function(projectName){
    WebAPIUtils.getProject( projectName )
    AppDispatcher.handleViewAction({
      type: "GET_PROJECT_DATA"
    });
  }

};