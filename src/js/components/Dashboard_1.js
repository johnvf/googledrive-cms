var React = require('react');

var Chart = require('../lib_components/Chart');

var Report = React.createClass({

    render: function(){

        var text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus."
        return (    
            <div className="container-fluid">
              <hr/>
              <div className="row">
                <div id="A" className="lg">
                  <Chart id="chartA"/>
                </div>
                <div id="B" className="sm">
                  {text}
                </div>
              </div>
              <hr/>
              <div className="row">
                <div id="C" className="sm">
                  {text}
                </div>
                <div id="D" className="lg">
                  <Chart id="chartB"/>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div id="E" className="lg">
                  <Chart id="chartC"/>
                </div>
                <div id="F" className="sm">
                  {text}
                </div>
              </div>
              <hr/>
            </div>
        )
    }
});


module.exports = Report