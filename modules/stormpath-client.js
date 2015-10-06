var stormpath = require('stormpath');
var uuid = require('uuid');
var nJwt = require('nJwt');

var client = null;

var homedir = process.cwd()

var appName = 'My Application'

var apiKey = new stormpath.ApiKey(
  process.env['STORMPATH_API_KEY_ID'],
  process.env['STORMPATH_API_KEY_SECRET']
);

var app;


function getApp(name){
    return new Promise( function(resolve,reject){
            // if (err){ throw err; reject(); }; // FIXME: Add proper error handling
            // if (err){ console.log(err); reject(); return};
            console.log("connecting to stormpath at %s", process.env['STORMPATH_URL']);
            client = new stormpath.Client({apiKey: apiKey});

            client.getApplication( process.env['STORMPATH_URL'], function(err, app){
                if (err) throw err;
                console.log("got app");
                resolve(app)
            });
    })

}

function login(  username, password, app ){
    return new Promise( function(resolve, reject){

        app.authenticateAccount({ username: username, password: password }, function (err, result) {
          // if (err){ throw err; reject(); }; // FIXME: Add proper error handling
          if (err){ console.log(err); reject(); return};
          console.log("logged in");
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
            console.log("got data");
            resolve(account)
          });
        });
    })
}

function makeToken( account ){
    return new Promise( function(resolve, reject){
        var split_url = account.href.split('/')

        var claims = {
          iss:  process.env['URL'], // this used to be 'http://localhost:5000/' is the trailing slash needed?The URL of your service
          sub: "users/"+split_url[split_url.length-1],    // The UID of the user in your system
          scope: account.projects
        }
        console.log("made token");
        var jwt = nJwt.create(claims, process.env['STORMPATH_SECRET_KEY'] )
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
    nJwt.verify(token, process.env['STORMPATH_SECRET_KEY'], function(err,decoded){    
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