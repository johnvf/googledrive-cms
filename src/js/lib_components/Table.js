var React = require('react');


function cells2Array( cells ){

    // Convert nested cells into a nested array
    var array = Object.keys( cells ).map(function( row_i ){
        var row_data = Object.keys( cells[row_i] ).map(function( col_i ){

            var cell = cells[row_i][col_i]
            return cell["value"]
        });

        return row_data
    });

    return array
}

function array2Table( array ){
    var th = []
    var td = []

    array.forEach(function(row, row_i){
        th.push( <th>{row[0]}</th> )
        td.push( <td>{row[1]}</td> )
    })

    return (
        <table className="table">
            <thead>
              <tr>
                {th}
              </tr>
            </thead>
            <tbody>
              <tr>
                {td}
              </tr>
            </tbody>
        </table>
    )
}

var Table = React.createClass({

    render: function(){

        var array = cells2Array( this.props.item.data.cells );

        var tableMarkup = array2Table(array)

        return (
            <div id={this.props.id} className="table-responsive">
                { tableMarkup }
            </div>
        )
    }
});

module.exports = Table