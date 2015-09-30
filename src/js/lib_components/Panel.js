var React = require('react');

var Panel = React.createClass({

  render: function(){
    var body;

    if( this.props.body ){
      body = (
        <div className="panel-body">
          <p>{this.props.body}</p>
        </div>
        )
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.heading}</div>
        { body }
        { this.props.children }
      </div>
      )
  }

});

module.exports = Panel