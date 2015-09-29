var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var _projects;

var _report;

var _reportLayouts;

var ProjectStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getProjects: function(){
    return _projects;
  },

  getReport: function(){
    return _report;
  },

  getReportLayouts: function(){
    return _reportLayouts;
  }

});

ProjectStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {


    case "RECEIVE_PROJECTS":
      _projects = action.projects
      ProjectStore.emitChange();
      break;


    case "RECEIVE_REPORT":
      _report = action.report
      ProjectStore.emitChange();
      break;

    case "RECEIVE_REPORT_LAYOUTS":
      _reportLayouts = action.reportLayouts
      ProjectStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = ProjectStore;