var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var CHANGE_EVENT = 'change';

var WebAPIUtils = require('../utils/WebAPIUtils');

var _loggedIn = false;

var LoginStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  login: function(email, pass, callback) {
    var self = this;
    if (localStorage.token) {
      _loggedIn = true
      if(callback){ callback( _loggedIn ); }
      self.emitChange();
      return;
    }
    if ( !!email && !!pass ){
      WebAPIUtils.login(email, pass, (res) => {
        if (res.authenticated) {
          localStorage.token = res.token;
          _loggedIn = true
        } else {
          _loggedIn = false
        }
        if(callback){ callback( _loggedIn ); }
        self.emitChange();
      });
    }
  },

  getToken: function () {
    return localStorage.token;
  },

  logout: function () {
    delete localStorage.token;
    _loggedIn = false
  },

  loggedIn: function () {
    return _loggedIn;
  },

});

LoginStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case "LOG_IN":
      LoginStore.login( action.username , action.password , action.callback)
      // LoginStore.emitChange();
      break;

    case "LOG_OUT":
      LoginStore.logout()
      LoginStore.emitChange();
      break;

    // case "LOGGED_IN":
    //   LoginStore.emitChange();
    //   break;

    // case "LOGGED_OUT":
    //   LoginStore.emitChange();
    //   break;

    default:
      // do nothing
  }

});

module.exports = LoginStore;