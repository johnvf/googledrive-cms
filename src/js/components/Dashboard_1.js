var React = require('react');

var Report = React.createClass({

    render: function(){

        return (    
            <div className="container-fluid">
              <pre>
                { JSON.stringify(this.props.items, undefined, 2)}
              </pre>
              <hr/>
              <div className="row">
                <div id="A" className="lg">
                </div>
                <div id="B" className="sm">
                </div>
              </div>
              <hr/>
              <div className="row">
                <div id="C" className="sm">
                </div>
                <div id="D" className="lg">
                </div>
              </div>
              <hr/>
              <div className="row">
                <div id="E" className="lg">
                </div>
                <div id="F" className="sm">
                </div>
              </div>
              <hr/>
            </div>
        )
    }
});


module.exports = Report