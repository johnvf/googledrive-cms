/*
 * Module for interacting with google drive
 * Requires service account key from https://console.developers.google.com
 * Assumes a single config.yaml in a folder shared with this service account
 */

var google = require('googleapis');
    spreadsheets = require("google-spreadsheets"),
    Promise = require('promise'),
    yaml = require('yamljs');

var request = require('request');
var utf8 = require('utf8')

var key = require('../.keys/google.json');
var scopes = ['https://www.googleapis.com/auth/drive'];
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes , null);

/*
 * Private
 */

function auth( ){
    return new Promise( function(resolve,reject){
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("authed")
            resolve( );        
        });
    })
}

function getProjectFolders( ){
    return new Promise( function(resolve,reject){
        console.log('loading project folders..')
        var drive = google.drive({ version: 'v2', auth: jwtClient });

        var q =  "title = 'CMS_ROOT'"
        drive.files.list({ auth: jwtClient, q: q}, function(err, resp) {

            var cms_folder = resp.items[0]
            q = "mimeType = 'application/vnd.google-apps.folder'"

            drive.children.list({ 'folderId': cms_folder.id, q: q }, function(err, resp){ 
                resolve( resp.items )
            });
        });
    })
}

function getProjects( folders ){
    return new Promise( function(resolve,reject){
        console.log('loading configs..')

        var folder_ids = folders.map( function( folder ){ return folder.id });
        
        var projects = folder_ids.map(  getProject );

        Promise.all( projects )
            .then(function (resp) {
                resolve(resp)
            });

    })
}

function getProject( folder_id ){
    return new Promise( function(resolve,reject){

        q ="title contains 'config'"
        var drive = google.drive({ version: 'v2', auth: jwtClient });

        drive.children.list({ 'folderId': folder_id, q: q }, function(err, resp){ 
            // console.log(resp);
            drive.files.get({ 'fileId': resp.items[0].id }, function(err, resp){ 

                var file_resource = resp

                request({
                  uri: file_resource.exportLinks['text/plain'],
                  headers: {
                    authorization: 'Bearer ' + jwtClient.credentials.access_token
                  }
                }, function( err, resp, body){
                    var cleanBody = utf8.encode(body.trim());
                    resolve( { folder: folder_id, config:  yaml.parse(cleanBody) } )
                });

            });

        }); 

    });      
}

// FIXME: If reports are configured in separate text files (which they should be), 
// this will change
function getReport( report_id, project ){
    return new Promise( function(resolve,reject){
        resolve( project.config.reports[report_id] )
    }); 
}

// Loads data from spreadsheets and assigns to config
function getData( report ){
    return new Promise( function(resolve,reject){
        // Array of items that need to have spreadsheet data loaded
        sheetRefItems = []

        Object.keys(report.items).forEach( function(item_key){
            var item = report.items[item_key]
            if( item.type === "chart" ){
                sheetRefItems.push( item )
            }
        })

        Promise.all( sheetRefItems.map( getSheetData ) ).done( function(){
            resolve( report )
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

function test( ){
    getProjectList( function(data){ console.log(data) });
}

if (!module.parent) {
    test();
}

// Connects to google drive, loads the configs from their folders, 
// and passes this information back to the callback
function getProjectList( callback ){
    console.log("getting projects...");
    auth()
        .then( getProjectFolders )
        .then( getProjects )
        .then( callback )
}

// Connects to google drive, loads the configs from their folders, 
// and passes this information back to the callback
function getProjectData( folder_id, report_id, callback ){
    console.log("getting project data...");
    auth()
        .then( getProject.bind( null, folder_id ))
        .then( getReport.bind( null, report_id))
        .then( getData )
        .then( callback )
}

module.exports = {
    getProjectList: getProjectList,
    getProjectData: getProjectData
}