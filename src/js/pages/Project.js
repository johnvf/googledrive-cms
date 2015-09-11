var React = require('react');
var Router = require('react-router');
var { Link } = Router;

// Components
var Dashboard = require('../components/Dashboard');

var Project = React.createClass({
    
  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    return (
    <div>
      PROJECT
      <Dashboard/>
    </div>
    );
  }
});

module.exports = Project;