// Load the Visualization API and the piechart package.
google.load('visualization', '1', {
  'packages': ['corechart']
});

/**
 * Load Drive API client library. Load the YAML
 */

var GAPI;

function loadAll(gapi) {
  GAPI = gapi;

  var config_file_id = "0B2GRGnCnDHZjV283R0VnbTFJdVk";
  GAPI.client.load('drive', 'v2', getFileContent.bind(null, config_file_id));
}

function getFileContent(file_id) {
  var request = GAPI.client.drive.files.get({
    'fileId': file_id
  });
  request.execute(function(resp) {
    console.log('Title: ' + resp.title);
    console.log('Description: ' + resp.description);
    console.log('MIME type: ' + resp.mimeType);
    downloadFile(resp, receiveProjectData)
  });


}

function downloadFile(file, callback) {
  if (file.downloadUrl) {
    var accessToken = GAPI.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

function receiveProjectData(data) {
  var project_data = jsyaml.load(data);
  console.log(project_data);

  makeReports(project_data);
}



function makeReports(project_data) {
  var report = project_data.reports["2015_0825 Water Usage"]
  makeReportBody( report )
  Object.keys(report.items).forEach(function(item_id) {
    var item_data = report.items[item_id]

    // Set this for later
    item_data.item_id = item_id

    // In a template, these divs already exist and don't have to be created
    // var item_div = document.createElement("div");
    // item_div.setAttribute("id", item_id);
    // document.body.appendChild(item_div);

    if( item_data.type == "chart"){
      makeChart(item_data);
    }
    else if( item_data.type == "text"){
      makeText(item_data);
    }
    
  });
}

function makeReportBody( report ){
  var element, content;
  var theDiv = document.getElementById("report");

  element = document.createElement('h3');
  content = document.createTextNode(report.title);
  element.appendChild(content);
  theDiv.appendChild(element);

  element = document.createElement('p');
  content = document.createTextNode(report.body);
  element.appendChild(content);
  theDiv.appendChild(element);
}

function makeText(item_data) {
  console.log(item_data)
  document.getElementById(item_data.item_id).innerHTML = item_data.body;
}

function makeChart(item_data) {
  var queryString = ["sheet=" + encodeURIComponent(item_data.sheet), "range=" + (item_data.range)].join("&")
  var query = new google.visualization.Query(item_data.url + "/gviz/tq?&" + queryString)
  query.send(handleChartQueryResponse.bind(null, item_data));
}

function handleChartQueryResponse(item_data, response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();

  // console.log(item_data)

  var chart = new google.visualization.ColumnChart(document.getElementById(item_data.item_id));
  chart.draw(data, {
    height: 400
  });

  function resize() {
    var chart = new google.visualization.ColumnChart(document.getElementById(item_data.item_id));
    chart.draw(data, {
      height: 400
    });
  }

  window.onload = resize();
  window.onresize = resize();
}

module.exports = {
  loadAll: loadAll
}