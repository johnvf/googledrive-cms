var React = require('react');

var Panel = React.createClass({

  render: function(){
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.heading}</div>
        <div className="panel-body">
          <p>{this.props.body}</p>
        </div>

        {this.props.children}
      </div>
      )
  }

});

module.exports = Panel