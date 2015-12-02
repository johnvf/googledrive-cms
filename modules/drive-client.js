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

var chartPreprocessor = require('./chart-preprocessor');

// Regexes to swap badly escaped newlines + unicode '=' from the key
var private_key = process.env['GAPI_PRIVATE_KEY'].replace(/\\n/g, '\n').replace(/\\u003d/g, "=");

var key = {
  private_key_id:  process.env['GAPI_PRIVATE_KEY_ID'],
  private_key: private_key,
  client_email:  process.env['GAPI_CLIENT_EMAIL'],
  client_id:  process.env['GAPI_CLIENT_ID'],
  type:  process.env['GAPI_TYPE']
};

var scopes = ['https://www.googleapis.com/auth/drive'];

var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes , null);
var drive = google.drive({ version: 'v2', auth: jwtClient });

var _layout;
var _layout_filename = ".layout.json"

/*
 * Private
 */

function auth( ){
    return new Promise( function(resolve,reject){
        jwtClient.authorize(function(err, tokens) {
            if (err){ reject(err);};
            console.log("authed")
            resolve( );        
        });
    })
}

function getDriveProjectFolders( ){
    return new Promise( function(resolve,reject){
        console.log('loading project folders..')

        var q =  "title = '" + process.env['CMS_ROOT_FOLDER'] +"'"
        
        drive.files.list({ auth: jwtClient, q: q}, function(err, resp) {
            if (err){ reject(err); };
            var cms_folder = resp.items[0]
            q = "mimeType = 'application/vnd.google-apps.folder'"

            drive.children.list({ 'folderId': cms_folder.id, q: q }, function(err, resp){ 
                resolve( resp.items )
            });
        });
    })
}

function getDriveProjects( projects_allowed, folders ){
    return new Promise( function(resolve,reject){
        console.log('loading configs..folders:')
        console.log( JSON.stringify(folders) );
        var folder_ids = folders.map( function( folder ){ return folder.id });
        
        var projects = folder_ids.map(  getDriveProject.bind( null, projects_allowed ) );

        Promise.all( projects )
        .catch( function(err){ reject(err); } )
        .then(function (resp) {
            var valid_projects = resp.filter(function(val) { return val !== null; })
            resolve( valid_projects )
        });

    })
}

function getDriveProjectPermission( projects_allowed, project_id ){
    return new Promise( function(resolve,reject){
        console.log('haz permission?..')

        if ( projects_allowed.indexOf("all") != -1 ){
            resolve( true );
        } 
        else {  
             drive.files.get({ 'fileId': project_id }, function(err, resp){
                if (err){ reject(err); };
                if ( projects_allowed.indexOf( resp.title ) != -1 ){
                    resolve( true );
                } 
                else{
                    resolve( false );
                }
            })
        }

    });
}

function getDriveProject( projects_allowed, project_id ){
    return new Promise( function(resolve,reject){
        

        getDriveProjectPermission( projects_allowed, project_id ).then(function( permitted ){
            if ( permitted ){
                console.log('loading project..')
                getConfig( project_id )
                .then( function(config){
                    var project = { project_id: project_id, config: config }

                    getDriveProjectReports( project ).then( function( project ){
                        resolve( project )
                    })
                    .catch( function(err){ console.error(err); resolve(null) })
                })
                .catch( function(err){  console.error(err); resolve(null) })
                
            }
            else{
                resolve(null);
            }


        })
        // .catch( function(err){ console.log("got here too!!"); reject();})
    });      
}

function getDriveProjectReports( project ){
     return new Promise( function(resolve,reject){
        console.log('loading report..')
        // Get all report folders
        q = "mimeType = 'application/vnd.google-apps.folder' and title != '_data'"
        drive.children.list({ 'folderId': project.project_id, q: q }, function(err, resp){ 
            if (err){ reject(err); };
            if( resp.items ){
                var folders = resp.items
                var folder_ids = folders.map( function( folder ){ return folder.id });

                // FIXME: Possibly add getFolderName & getFolderId to convert from name to id and back
                // this would allow us to have clean URLs... eg project_foo/report_bar
                // For now, just using the google folder_id
                // var folder_names = folders.map( getFolderName ) 

                Promise.all( folder_ids.map(  getConfig ) )
                .catch( function(err){ console.log("caught"); reject(err); })
                .then(function (reportConfigs) {
                    project.config.reports = {}
                    // Maps folder ids to report ids
                    reportConfigs.forEach( function(reportConfig, i){
                        project.config.reports[ folder_ids[i]] = reportConfig
                    })
                    resolve( project )
                });
            }
            else{
                console.error( "empty report" );
                resolve(null)
            }
        }); 

    });      
}

// FIXME: If reports are configured in separate text files (which they should be), 
// this will change
function getDriveReport( report_id, project ){
    return new Promise( function(resolve,reject){
        if( project ){
            resolve( project.config.reports[report_id] )
        }
        else{
            reject();
        }
    }); 
}

// Loads data from spreadsheets and assigns to config
function getDriveData( report ){
    return new Promise( function(resolve,reject){
        // Array of items that need to have spreadsheet data loaded
        sheetRefItems = []

        Object.keys(report.items).forEach( function(item_key){
            var item = report.items[item_key]
            if( item.type === "chart" || item.type === "table" ){
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
            if (err){ reject(err);};
            spreadsheet.worksheets[parseInt(item.sheet)].cells({ range: item.range}, function(err, cells) {
                if (err){ reject(err);};
                var data = chartPreprocessor.processGoogleSheet( cells )
                item.data = data
                resolve( data )
            });
        });
    });
}

function getDriveReportLayout( project_id, report_id ){
    return new Promise( function(resolve,reject){

        q ="title = '" + _layout_filename + "'"

        drive.children.list({ 'folderId': report_id, q: q }, function(err, resp){ 
            if (err){ reject(err);};
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

    q ="title = '" + _layout_filename + "'"

    drive.children.list({ 'folderId': report_id, q: q }, function(err, resp){ 
        if (err){ reject(err); };
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
                title: _layout_filename,
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

function getDocAsPlaintext( file_resource , folder_id ){
    return new Promise( function(resolve,reject){
        
        if( !!file_resource ){
            console.log("getting file id: "+ file_resource.id+ ' in '+ folder_id )
            drive.files.get({ 'fileId': file_resource.id }, function(err, resp){ 
                if (err){ reject(err); };
                if( !!resp ){

                   request({
                      uri: resp.exportLinks['text/plain'],
                      headers: {
                        authorization: 'Bearer ' + jwtClient.credentials.access_token
                      }
                    }, function( err, resp, body){
                        if (err){ reject(err); };
                        var cleanBody = body.trim();
                        resolve( cleanBody );
                    }); 

                }
                else{
                    console.error("file not found in folder "+ folder_id)
                    reject()   
                }

            });  
        }
        else{
            console.error("file not found in folder "+ folder_id);
            reject()
        }

    })
}

function getConfig( folder_id ){
    return new Promise( function(resolve,reject){
        console.log("getting config from folder: "+folder_id)
        q ="title contains 'config'"
        drive.children.list({ 'folderId': folder_id, q: q }, function(err, resp){ 
            if (err){ reject(err); };
            var file_resource = resp.items[0]
            console.log(file_resource)

            getDocAsPlaintext( file_resource , folder_id )
            .then( function(configText){
                var yamlConfig;
                try{
                    yamlConfig = yaml.parse(configText)
                }
                catch(err){ 
                    throw "bad YAML @ folder:"+ folder_id;
                }
                
                resolve( yamlConfig )
            })
            .catch( function(err){ reject(err); });

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
function getProjects( projects_allowed, callback, errback ){
    console.log("getting projects...");
    auth()
    .then( getDriveProjectFolders )
    .then( getDriveProjects.bind( null, projects_allowed) )
    .then( callback )
    .catch( errback )
}

// Connects to google drive, loads the configs from their folders, 
// and passes this information back to the callback
function getReport( projects_allowed, project_id, report_id, callback, errback  ){
    console.log("getting project data...");
    auth()
    .then( getDriveProject.bind( null, projects_allowed, project_id ))
    .then( getDriveReport.bind( null, report_id ))
    .then( getDriveData )
    .then( callback )
    .catch( errback )
}

function getReportLayout( project_id, report_id, callback, errback  ){
    console.log("getting report layout...")
    auth()
    .then( getDriveReportLayout.bind( null, project_id, report_id ))
    .then( callback )
    .catch( errback )
}

function saveReportLayout( project_id, report_id, layout, callback, errback ){
    console.log("saving report layout...") 
    auth()
    .then( saveDriveReportLayout.bind( null, project_id, report_id, layout ))
    .then( callback )
    .catch( errback )
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