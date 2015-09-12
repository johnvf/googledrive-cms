var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var _jwt;

var LoginStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getJWT: function(){
    return _jwt;
  },

  autoLogin: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      _jwt = jwt;
      // FIXME: Add support for this...
      // this._user = jwt_decode(this._jwt);
    }
  }

});

LoginStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "LOGGED_IN":
      _jwt = action.jwt
      localStorage.setItem("jwt", action.jwt)
      LoginStore.emitChange();
      break;

    case "LOGGED_OUT":
      _jwt = null;
     localStorage.setItem("jwt", null)
      LoginStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = LoginStore;