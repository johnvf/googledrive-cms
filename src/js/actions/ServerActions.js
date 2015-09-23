var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  loggedIn: function(jwt) {

    AppDispatcher.handleServerAction({
      type: "LOGGED_IN",
      jwt: jwt
    });
  },

  loggedOut: function(res) {
    AppDispatcher.handleServerAction({
      type: "LOGGED_OUT"
    });
  },

  receiveProjects: function(projects) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_PROJECTS",
      projects: projects
    });
  }

};