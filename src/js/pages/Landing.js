var React = require('react');

var Loader = require('react-loader');

var ProjectStore = require('../stores/ProjectStore')

var Project = require('../components/Project')

function getStateFromStores() {
  return {
    projects: ProjectStore.getProjects(),
    loaded: false
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
    ProjectStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    if(this.isMounted()) {
      this.setState(getStateFromStores());
    }
  },

  render: function() {
    var projects, project_components, loaded;
    loaded = this.state.loaded;
    console.log("landing")
    if( this.state.projects ){
      if( this.state.projects.length > 0){
        loaded = true;
        project_components = this.state.projects.map( function(project, i){ 
          return <Project key={i} project={project}/>
        });
      }
    }

    return (
      
        <div>
          <Loader loaded={loaded}>
            {project_components}
          </Loader>
        </div>
    );
  }
});

module.exports = Landing;