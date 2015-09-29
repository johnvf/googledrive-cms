var React = require('react');

var c3 = require('c3')

function cellsToRowCols( cells ){
    var data = Object.keys( cells ).map(function( row_i ){
        row_cells = cells[row_i]
        var row_data = Object.keys( row_cells ).map(function( col_i ){
            var cell = cells[row_i][col_i]
            return cell["value"]
        });
        return row_data
    });
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
                rows: data
            }
        });
    },

    componentDidMount: function () {
        // console.log("re-render chart");
        var self = this;
        var data = cellsToRowCols( this.props.item.data.cells )
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