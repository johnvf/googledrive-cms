var React = require('react');
var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var Link = routerModule.Link;
var History = routerModule.History;


var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')


function getStateFromStores() {
  return {
    project: ProjectStore.getProject()
  };
}

var Landing = React.createClass({

  /**
   * State Boilerplate 
   */
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    ViewActions.getProject("Eden Housing");
    ProjectStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {
    var project = JSON.stringify(this.state.project, null, 2) || ''
    return (
    <div>
      LANDING
      <pre>
      {project}
      </pre>
    </div>
    );
  }
});

module.exports = Landing;