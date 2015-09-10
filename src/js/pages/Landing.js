var React = require('react');
var Router = require('react-router');
var { Link } = Router;

var ProjectStore = require('../stores/ProjectStore')

var Login = require('../components/Login')

function getStateFromStores() {
  return {
    project: ProjectStore.getProject(),
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
      <Login/>
      <pre>
      {project}
      </pre>
    </div>
    );
  }
});

module.exports = Landing;