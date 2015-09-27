var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var _projects;

var _projectData;

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

  getProjectData: function(){
    return _projectData;
  }

});

ProjectStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {


    case "RECEIVE_PROJECTS":
      _projects = action.projects
      ProjectStore.emitChange();
      break;


    case "RECEIVE_PROJECT_DATA":
      _projectData = action.projectData
      ProjectStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = ProjectStore;