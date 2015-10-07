var React = require('react');


function data2Table( array ){
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

        var tableMarkup = data2Table( this.props.item.data )

        return (
            <div id={this.props.id} className="table-responsive"  style={ {overflow: "hidden"} }>
                { tableMarkup }
            </div>
        )
    }
});

module.exports = Table