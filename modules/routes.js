var driveClient = require('./drive-client')

module.exports = function (app) {
    app.get('/data', function(req, res) {

        driveClient.load( function(data){ 
            res.send(data);
            // console.log(JSON.stringify(data, undefined, 2));
            // console.log("success");
        });
      
    });

    // app.get('*', function (req, res) {
    //   res.sendFile('../dist/index.html');
    // });

};