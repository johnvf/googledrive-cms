var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var SessionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getLoggedIn: function(){
    return localStorage.loggedIn;
  },

});

SessionStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "LOGGED_IN":
      localStorage.loggedIn = 1;
      SessionStore.emitChange();
      break;

    case "LOGGED_OUT":
     localStorage.loggedIn = 0;
      SessionStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = SessionStore;