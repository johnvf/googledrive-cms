var loader = require('./loader.js')

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
// FIXME: Need to move 'service level auth' to server instead
var CLIENT_ID = // REMOVED to protect the innocent - ;

var SCOPES = ['https://www.googleapis.com/auth/drive'];

var GAPI;
/**
 * Check if current user has authorized this application.
 */

function checkAuth() {
  require( 'google-client-api' )( function( gapi ) {
    GAPI = gapi;
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': true
    }, handleAuthResult);

  });
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loader.loadAll(GAPI);
  } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  require( 'google-client-api' )( function( gapi ) {
    GAPI = gapi;
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': false
    },
    handleAuthResult);

  });

  return false;
}


module.exports = {
  handleAuthClick: handleAuthClick,
  checkAuth: checkAuth
}