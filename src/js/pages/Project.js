var React = require('react');

// Components
var Dashboard = require('../components/Dashboard');

var Project = React.createClass({

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