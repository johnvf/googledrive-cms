// Need to load google api async.
// Current 'browserify' version of google api is broken...
apiLoaded = function(){

	window.auth = require('./utils/auth.js');
	window.auth.checkAuth();

}