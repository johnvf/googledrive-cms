var React = require('react');
var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var Link = routerModule.Link;
var History = routerModule.History;

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