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
var drive = google.drive({ version: 'v2', auth: jwtClient });

var _layout;

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

function getDriveProjectFolders( ){
    return new Promise( function(resolve,reject){
        console.log('loading project folders..')

        var q =  "title = 'NEW_CMS'"
        drive.files.list({ auth: jwtClient, q: q}, function(err, resp) {

            var cms_folder = resp.items[0]
            q = "mimeType = 'application/vnd.google-apps.folder'"

            drive.children.list({ 'folderId': cms_folder.id, q: q }, function(err, resp){ 
                resolve( resp.items )
            });
        });
    })
}

function getDriveProjects( folders ){
    return new Promise( function(resolve,reject){
        console.log('loading configs..')

        var folder_ids = folders.map( function( folder ){ return folder.id });
        
        var projects = folder_ids.map(  getDriveProject );

        Promise.all( projects )
        .then(function (resp) {
            resolve(resp)
        });

    })
}

function getDriveProject( project_id ){
    return new Promise( function(resolve,reject){
        console.log('loading project..')
        // Maps folder Ids to project ids
        getConfig( project_id ).then( function(config){
            var project = { project_id: project_id, config: config }

            getDriveProjectReports( project ).then( function( project ){
                resolve( project )
            })
        })
    });      
}

function getDriveProjectReports( project ){
     return new Promise( function(resolve,reject){
        console.log('loading report..')
        // Get all report folders
        q = "mimeType = 'application/vnd.google-apps.folder' and title != '_data'"
        drive.children.list({ 'folderId': project.project_id, q: q }, function(err, resp){ 

            var folders = resp.items
            var folder_ids = folders.map( function( folder ){ return folder.id });

            // FIXME: Possibly add getFolderName & getFolderId to convert from name to id and back
            // this would allow us to have clean URLs... eg project_foo/report_bar
            // For now, just using the google folder_id
            // var folder_names = folders.map( getFolderName ) 

            Promise.all( folder_ids.map(  getConfig ) )
            .then(function (reportConfigs) {
                project.config.reports = {}
                // Maps folder ids to report ids
                reportConfigs.forEach( function(reportConfig, i){
                    project.config.reports[ folder_ids[i]] = reportConfig
                })
                resolve( project )
            });

        }); 

    });      
}

// FIXME: If reports are configured in separate text files (which they should be), 
// this will change
function getDriveReport( report_id, project ){
    return new Promise( function(resolve,reject){
        resolve( project.config.reports[report_id] )
    }); 
}

// Loads data from spreadsheets and assigns to config
function getDriveData( report ){
    return new Promise( function(resolve,reject){
        // Array of items that need to have spreadsheet data loaded
        sheetRefItems = []

        Object.keys(report.items).forEach( function(item_key){
            var item = report.items[item_key]
            if( item.type === "chart" ){
                sheetRefItems.push( item )
            }
        })

        Promise.all( sheetRefItems.map( getDriveSheetData ) ).done( function(){
            resolve( report )
        });
    });
}

// Loads data from a spreadsheet
function getDriveSheetData( item ){
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

function getDriveReportLayout( project_id, report_id ){
    return new Promise( function(resolve,reject){

        q ="title contains '" + report_id + "_layout.json' "

        drive.children.list({ 'folderId': report_id, q: q }, function(err, resp){ 
            console.log(resp);

            if ( resp.items[0] ){
                drive.files.get({ 'fileId': resp.items[0].id, 'alt': 'media' }, function(err, resp){
                    resolve( resp )
                })
            }
            else{
                resolve( null )
            }
        });
    }) 
}

function saveDriveReportLayout( project_id, report_id, layout ){

    q ="title contains '" + report_id+"_layout.json' "

    drive.children.list({ 'folderId': report_id, q: q }, function(err, resp){ 
        console.log(resp);

        if ( resp.items[0] )
            drive.files.update({ 
                'fileId': resp.items[0].id,
                media: {
                    mimeType: 'text/plain',
                    body: JSON.stringify(layout)
                }
            });
        else{
            drive.files.insert({
              resource: {
                title: report_id+"_layout.json",
                mimeType: 'text/plain',
                parents: [{id: report_id }]
              },
              media: {
                mimeType: 'text/plain',
                body: JSON.stringify(layout)
              }
            });
        }
    });

    return true
}

/*
 * Utils
 */

function getDocAsPlaintext( file_resource ){
    return new Promise( function(resolve,reject){

        drive.files.get({ 'fileId': file_resource.id }, function(err, resp){ 

            var file_resource = resp

            request({
              uri: file_resource.exportLinks['text/plain'],
              headers: {
                authorization: 'Bearer ' + jwtClient.credentials.access_token
              }
            }, function( err, resp, body){
                var cleanBody = utf8.encode(body.trim());
                resolve( cleanBody );
            });

        });
    })
}

function getConfig( folder_id ){
    return new Promise( function(resolve,reject){
        q ="title contains 'config'"

        drive.children.list({ 'folderId': folder_id, q: q }, function(err, resp){ 
            var file_resource = resp.items[0]
            getDocAsPlaintext( file_resource ).then( function(configText){
                resolve( yaml.parse(configText) )
            })
        });        
    })
}

function log(){
    if(console){
        console.log.apply(console, arguments);
    }
}

function log_test(arg){
    console.log( JSON.stringify(arg, null, 2) )
}
/*
 * Public
 */

// TESTED - works
function test( ){
    console.log("Testing ...");
    // auth()
    // .then( getDriveProjectFolders )
    // .then( getDriveProjects )
    // .then( log_test )

    var project_id = "0B2GRGnCnDHZjczcxVVVzY3I5ZU0";
    var report_id = "0B2GRGnCnDHZjMWQzaFUxVmozN2s";

    auth()
    .then( getDriveProject.bind( null, project_id ))
    .then( getDriveReport.bind( null, report_id))
    .then( getDriveData )
    .then( log_test )
}

// Connects to google drive, loads the configs from their folders, 
// and passes this information back to the callback
function getProjects( callback ){
    console.log("getting projects...");
    auth()
    .then( getDriveProjectFolders )
    .then( getDriveProjects )
    .then( callback )
}

// Connects to google drive, loads the configs from their folders, 
// and passes this information back to the callback
function getReport( project_id, report_id, callback ){
    console.log("getting project data...");
    auth()
    .then( getDriveProject.bind( null, project_id ))
    .then( getDriveReport.bind( null, report_id))
    .then( getDriveData )
    .then( callback )
}

function getReportLayout( project_id, report_id, callback ){
    console.log("getting report layout...")
    auth()
    .then( getDriveReportLayout.bind( null, project_id, report_id ))
    .then( callback )
}

function saveReportLayout( project_id, report_id, layout, callback){
    console.log("saving report layout...") 
    auth()
    .then( saveDriveReportLayout.bind( null, project_id, report_id, layout ))
    .then( callback )
}

if (!module.parent) {
    test();
}

module.exports = {
    getProjects: getProjects,
    getReport: getReport,
    getReportLayout: getReportLayout,
    saveReportLayout: saveReportLayout
}