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
  },

  receiveReport: function(report) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_REPORT",
      report: report
    });
  },

  receiveReportLayouts: function(reportLayouts) {
    AppDispatcher.handleServerAction({
      type: "RECEIVE_REPORT_LAYOUTS",
      reportLayouts: reportLayouts
    });
  },

};