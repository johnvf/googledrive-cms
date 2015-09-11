var React = require('react');
var Router = require('react-router');
var { Link } = Router;


var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')


function getStateFromStores() {
  return {
    project: ProjectStore.getProject()
  };
}

var Landing = React.createClass({
    
  contextTypes: {
    router: React.PropTypes.func
  },

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