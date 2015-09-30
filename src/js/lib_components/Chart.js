var React = require('react');

var c3 = require('c3')

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

function array2JSON( array){
    // For convenience, convert each row into a JSON
    var data = array.map(function(row, row_i){
        return { "xAxis": row[0], "value": row[1] }
    })

    return data
}

var Chart = React.createClass({
    // ...
    _renderChart: function (data) {
        // save reference to our chart to the instance
        console.log(data);
        this.chart = c3.generate({
            bindto: '#'+this.props.id,
            data: {
                json: data,
                keys: {
                  x: 'xAxis', // it's possible to specify 'x' when category axis
                  value: ['value'],
                }
            },
            axis: {
                x: {
                  type: 'category'
                }
            }
        })
    },

    componentDidMount: function () {
        // console.log("re-render chart");
        var self = this;
        var data = array2JSON( cells2Array( this.props.item.data.cells ) );
        this._renderChart(data);

        // FIXME: This shouldn't be necessary - prop updates should work too
        this.props.subscribeToLayoutChange( function(){ 
            console.log("resize chart");
            self.chart.resize() 
        })
    },


    componentWillReceiveProps: function (newProps) {
        // TODO: Update graph data if new data is loaded.
        // this would allow the graph to be dynamic..
    },

    render: function(){
        return <div id={this.props.id}/>
    }
});

module.exports = Chart