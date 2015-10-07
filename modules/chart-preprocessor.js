function processGoogleSheet( data ){
    console.log( JSON.stringify(data));
    var cells = data.cells;
    // Convert nested cells into a nested array
    var array = Object.keys( cells ).map(function( row_i ){
        var row_data = Object.keys( cells[row_i] ).map(function( col_i ){

            var cell = cells[row_i][col_i]
            return cell["value"]
        });

        return row_data
    });
    console.log( JSON.stringify(array));
    return array
}

module.exports = {
    processGoogleSheet: processGoogleSheet
}