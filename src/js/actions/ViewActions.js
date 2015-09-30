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
  
  saveReportLayouts: function(project_id , report_id, reportLayouts){
    WebAPIUtils.saveReportLayouts(project_id , report_id, reportLayouts)
    AppDispatcher.handleViewAction({
      type: "SAVE_REPORT_LAYOUTS",
      report_id: report_id,
      reportLayouts: reportLayouts
    });
  }

}