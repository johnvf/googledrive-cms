var React = require('react');

var c3 = require('c3')

var Chart = React.createClass({
    // ...
    _renderChart: function (item) {
        // save reference to our chart to the instance
        this.chart = c3.generate({
            bindto: '#'+this.props.id,
            data: {
                rows: item.data,
                x : 'x',
                type: item.chart_type,
                types: item.types
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
        this._renderChart(this.props.item);

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