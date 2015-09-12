var stormpath = require('stormpath');
var uuid = require('uuid');
var nJwt = require('nJwt');

// FIXME: Should this be passed in via some environment variable?
// Needs to be shared by all containers running the app.
// Perhaps use the application secret key when loaded?
var signingKey = uuid.v4(); // For example purposes

var client = null;

var homedir = process.cwd()
var keyfile = homedir + '/.keys/stormpath.properties';
var appName = 'My Application'

var app;

function getApp(name){
    return new Promise( function(resolve,reject){
        stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
            // if (err){ throw err; reject(); }; // FIXME: Add proper error handling
            if (err){ console.log(err); reject(); return};

            client = new stormpath.Client({apiKey: apiKey});

            client.getApplications({name: name }, function(err, applications){
                if (err) throw err;

                app = applications.items[0];
                resolve(app)
            });
        });
    })

}

function login(  username, password, app ){
    return new Promise( function(resolve, reject){

        app.authenticateAccount({ username: username, password: password }, function (err, result) {
          // if (err){ throw err; reject(); }; // FIXME: Add proper error handling
          if (err){ console.log(err); reject(); return};

          account = result.account;
          resolve( account )
        });
    })
}

function getCustomData( account ){
    return new Promise( function(resolve, reject){
        client.getAccount(account.href, function(err, account) {
          account.getCustomData(function(err, customData) {
            account.projects = customData.projects
            resolve(account)
          });
        });
    })
}

function makeToken( account ){
    return new Promise( function(resolve, reject){
        var split_url = account.href.split('/')

        var claims = {
          iss: "http://localhost:3000/",  // The URL of your service
          sub: "users/"+split_url[split_url.length-1],    // The UID of the user in your system
          scope: account.projects
        }

        var jwt = nJwt.create(claims,signingKey)
        resolve( jwt.compact() )
    })
}

function getToken( username, password , callback ){
    if (!!username && !!password ){
        if( !app ){
            getApp(appName)
            .then( login.bind( this, username, password ) )
            .then( getCustomData )
            .then( makeToken )
            .then( callback );
        }
        else{
            login( username, password, app )
            .then( getCustomData )
            .then( makeToken )
            .then( callback );
        }
    }
    else{
        console.log('No username or password');
    }
}

function verifyToken( req, res, next, token ){
    // verifies secret and checks exp
    nJwt.verify(token, signingKey, function(err,decoded){    
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
}

module.exports = {
    getToken: getToken,
    verifyToken: verifyToken
}