var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var _jwt;
var _nextRouterPath = null;

var LoginStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  nextTransitionPath: function() {
    var nextPath = _nextRouterPath;
    _nextRouterPath = null;
    return nextPath;
  }

});

LoginStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "ROUTER_NEXT_TRANSITION_PATH":
      _nextRouterPath = action.path;
      break;

    default:
      // do nothing
  }

});

module.exports = LoginStore;