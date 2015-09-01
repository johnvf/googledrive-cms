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

  var config_file_id = "0B2GRGnCnDHZjc1A0UFRTOEhsd2M";
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

  drawReports(project_data);
}



function drawReports(project_data) {
  var report = project_data.reports["2015_0825 Water Usage"]

  Object.keys(report.charts).forEach(function(chart_id) {
    var chart_data = report.charts[chart_id]

    // Set this for later
    chart_data.chart_id = chart_id

    var chart_div = document.createElement("div");
    chart_div.setAttribute("id", chart_id);
    document.body.appendChild(chart_div);

    drawChart(chart_data)
  });
}

function drawChart(chart_data) {
  var queryString = ["sheet=" + encodeURIComponent(chart_data.sheet), "range=" + (chart_data.range)].join("&")
  var query = new google.visualization.Query(chart_data.url + "/gviz/tq?&" + queryString)
  query.send(handleChartQueryResponse.bind(null, chart_data));
}

function handleChartQueryResponse(chart_data, response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();

  console.log(chart_data)

  var chart = new google.visualization.ColumnChart(document.getElementById(chart_data.chart_id));
  chart.draw(data, {
    height: 400
  });

  function resize() {
    var chart = new google.visualization.ColumnChart(document.getElementById(chart_data.chart_id));
    chart.draw(data, {
      height: 400
    });
  }

  window.onload = resize();
  window.onresize = resize;
}

module.exports = {
  loadAll: loadAll
}