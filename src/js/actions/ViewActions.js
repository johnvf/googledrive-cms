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

  getReport: function(project_id , report_id){
    WebAPIUtils.getReport(project_id , report_id)
    AppDispatcher.handleViewAction({
      type: "GET_REPORT"
    });
  },

  getReportLayouts: function(project_id , report_id){
    WebAPIUtils.getReportLayouts(project_id , report_id)

  },

  saveReportLayouts: function(project_id , report_id, layouts){
    WebAPIUtils.saveReportLayouts(project_id , report_id, layouts)
  }

};