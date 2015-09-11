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

  receiveProject: function(project) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_PROJECT",
      project: project
    });
  }

};