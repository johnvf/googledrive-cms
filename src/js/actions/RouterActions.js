var AppDispatcher = require('../dispatcher/AppDispatcher');

var WebAPIUtils = require('../utils/WebAPIUtils');

module.exports = {

  storeRouterTransitionPath: function(path) {
    AppDispatcher.handleRouterAction({
      type: "ROUTER_NEXT_TRANSITION_PATH",
      path: path
    });
  }

};