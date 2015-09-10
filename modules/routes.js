var driveClient = require('./drive-client')
var stormpathClient = require('./stormpath-client')

module.exports = function (app) {
    app.get('/data', function(req, res) {

        driveClient.load( function(data){ 
            res.send(data);
            // console.log(JSON.stringify(data, undefined, 2));
            // console.log("success");
        });
      
    });

    app.get('/sessions/create', function(req, res) {

        stormpathClient.createSession( function(user){
            console.log(user);
        });
      
    });

    // app.get('*', function (req, res) {
    //   res.sendFile('../dist/index.html');
    // });

};