var React = require('react');

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')

var Project = require('../components/Project')

function getStateFromStores() {
  return {
    projects: ProjectStore.getProjects()
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
    ViewActions.getProjects();
    ProjectStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {
    var projects = this.state.projects || [];

    var project_components = projects.map( function(project){ 
      return <Project project={project}/>
    });

    return (
    <div>
      {project_components}
    </div>
    );
  }
});

module.exports = Landing;