var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  receiveProject: function(project) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_PROJECT",
      project: project
    });
  }

};