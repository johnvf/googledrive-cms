/*
 * Module for interacting with google drive
 * Requires service account key from https://console.developers.google.com
 * Assumes a single config.yaml in a folder shared with this service account
 */

var google = require('googleapis'),
    yaml = require('yamljs');

var key = require('../key.json');
var scopes = ['https://www.googleapis.com/auth/drive']
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes , null);

/*
 * Private
 */

function getConfig(){

    var drive = google.drive({ version: 'v2', auth: jwtClient });
    // Make an authorized request to list Drive files.
    drive.files.list({ auth: jwtClient }, function(err, resp) {
        // handle err and response
        // console.log(resp);
        resp.items.forEach(function(item){
            if( item.title == "config.yaml" ){
                console.log(item.id)
                drive.files.get({ 'fileId': item.id , 'alt': 'media'}, function(err, resp){ 
                    var config = yaml.parse(resp)
                    console.log( JSON.stringify(config, null, 2) )
                } );
            }
        })
    });
}

/*
 * Public
 */

function initialize( ){
    jwtClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return;
        }
        getConfig();
    });
}

module.exports = {
    initialize: initialize
}