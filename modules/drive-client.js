/*
 * Module for interacting with google drive
 * Requires service account key from https://console.developers.google.com
 * Assumes a single config.yaml in a folder shared with this service account
 */

var google = require('googleapis');
    spreadsheets = require("google-spreadsheets"),
    Promise = require('promise'),
    yaml = require('yamljs');

var key = require('../.keys/google.json');
var scopes = ['https://www.googleapis.com/auth/drive'];
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes , null);

/*
 * Private
 */

// Loads the config object
function getConfig( ){
    return new Promise( function(resolve,reject){
        var drive = google.drive({ version: 'v2', auth: jwtClient });
        // Make an authorized request to list Drive files.
        drive.files.list({ auth: jwtClient }, function(err, resp) {

            resp.items.forEach(function(item){
                if( item.title == "config.yaml" ){
                    console.log(item.id)
                    drive.files.get({ 'fileId': item.id , 'alt': 'media'}, function(err, resp){ 
                        var config = yaml.parse(resp)
                        resolve(config);
                    } );
                }
            })
        });
    });
}

// Loads data from spreadsheets and assigns to config
function getData( config ){
    return new Promise( function(resolve,reject){
        // Array of items that need to have spreadsheet data loaded
        sheetRefItems = []

        Object.keys(config.reports).forEach( function(report_key){
            var report = config.reports[report_key]
            Object.keys(report.items).forEach( function(item_key){
                var item = report.items[item_key]
                if( item.type === "chart" ){
                    sheetRefItems.push( item )
                }
            })
        })

        Promise.all( sheetRefItems.map( getSheetData ) ).done( function(){
            resolve( config )
        });
    });
}

// Loads data from a spreadsheet
function getSheetData( item ){
    return new Promise( function(resolve,reject){
        spreadsheets({ key: item.key, auth: jwtClient }, function(err, spreadsheet) {
            if(!spreadsheet){
                console.log(err);
                reject();
                return
            }
            spreadsheet.worksheets[parseInt(item.sheet)].cells({ range: item.range}, function(err, cells) {
                item.data = cells
                resolve( cells )
            });
        });
    });
}

/*
 * Public
 */

// Connects to google drive, loads the config, 
// populates the config with data, 
// and finally calls the callback with the data-loaded config
function load( callback ){
    jwtClient.authorize(function(err, tokens) {

        if (err) {
            console.log(err);
            return;
        }

        getConfig().then( getData ).then( callback );
    });
}

module.exports = {
    load: load
}