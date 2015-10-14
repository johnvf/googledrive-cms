var stormpath = require('stormpath');
var uuid = require('uuid');
var njwt = require('njwt');

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
            console.log("connecting to stormpath at %s", process.env['STORMPATH_URL']);
            client = new stormpath.Client({apiKey: apiKey});

            client.getApplication( process.env['STORMPATH_URL'], function(err, app){
                if (err){ reject(err);};
                console.log("got app");
                resolve(app)
            });
    })

}

function login(  username, password, app ){
    return new Promise( function(resolve, reject){

        app.authenticateAccount({ username: username, password: password }, function (err, result) {
          if (err){ reject( err.userMessage ); }
          else{
            console.log("logged in");
            account = result.account;
            resolve( account ) 
          }
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
        var jwt = njwt.create(claims, process.env['STORMPATH_SECRET_KEY'] )
        resolve( jwt.compact() )
    })
}

function getToken( username, password , callback, errback ){
    if (!!username && !!password ){
        if( !app ){
          getApp(appName)
          .then( login.bind( this, username, password ) )
          .catch( errback )
          .then( getCustomData )
          .then( makeToken )
          .then( callback )   
        }
        else{
          login( username, password, app )
          .catch( errback )
          .then( getCustomData )
          .then( makeToken )
          .then( callback )
        }
    }
    else{
        console.log('No username or password');
    }
}

function verifyToken( req, res, next, token ){
    console.log("got here")
    // verifies secret and checks exp
    njwt.verify(token, process.env['STORMPATH_SECRET_KEY'], function(err,decoded){    
      // if (err) { console.log("unable to verify"); throw err; } 
      if (err) { console.log("unable to verify"); next(err.userMessage);  } 
      else {
        
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