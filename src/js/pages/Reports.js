var React = require('react');
var Router = require('react-router');
var { Link } = Router;

// Components
var Report = require('../components/Report');

var Reports = React.createClass({
    
  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    return (
    <div>
      REPORT
      <Report/>
    </div>
    );
  }
});

module.exports = Reports;