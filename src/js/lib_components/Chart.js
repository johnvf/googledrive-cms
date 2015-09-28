var React = require('react');

var c3 = require('c3')

function cellsToRowCols(cells){
    
}

var Chart = React.createClass({
    // ...
    _renderChart: function (data) {
        // save reference to our chart to the instance
        this.chart = c3.generate({
            bindto: '#'+this.props.id,
            data: {
              columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
                ]
              }
        });
    },

    componentDidMount: function () {
        // console.log("re-render chart");
        this._renderChart(this.props.data);
    },


    componentWillReceiveProps: function (newProps) {
        // this.chart.load({
        //     json: newProps.data
        // }); // or whatever API you need
        
        // this._renderChart(this.props.data);
        console.log("resize chart");
         this._renderChart();
        // this.render();
    },

    render: function(){
        return <div id={this.props.id}/>
    }
});

module.exports = Chart