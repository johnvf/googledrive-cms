var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  loggedIn: function(res) {

    AppDispatcher.handleServerAction({
      type: "LOGGED_IN"
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