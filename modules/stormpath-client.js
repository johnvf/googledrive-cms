var stormpath = require('stormpath');
var client = null;

// For a globally stored stormpath key:
// var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
// var keyfile = homedir + '/.stormpath/apiKey.properties';

var homedir = process.cwd()
var keyfile = homedir + '/.keys/stormpath.properties';

function getApp(name){
    return new Promise( function(resolve,reject){
        stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
            if (err){ throw err; reject(); };
            client = new stormpath.Client({apiKey: apiKey});

            client.getApplications({name: name }, function(err, applications){
                if (err) throw err;

                app = applications.items[0];
                resolve(app)
            });
        });
    })

}

function login( app, username, password ){
    return new Promise( function(resolve, reject){
       //using username and password
        app.authenticateAccount({ username: username, password: password }, function (err, result) {
          if (err){ throw err; reject(); };
          account = result.account;
          resolve( account )
        });
    })
}


function createSession( username, password , callback ){
    getApp('My Application').then( login.bind( username, password ) ).then( callback );
}

module.exports = {
    createSession: createSession
}