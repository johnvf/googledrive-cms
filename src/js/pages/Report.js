var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')

var Project = require('../components/Project')

function getStateFromStores() {
  return {
    projectData: ProjectStore.getProjectData(),
    loaded: false
  };
}

var Panel = require('../lib_components/Panel')

// Components
var Dashboard = require('../components/Dashboard_1');

var Report = React.createClass({
  /**
   * State Boilerplate 
   */
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {

    var { folder_id, report_id } = this.props.params;
    ViewActions.getProjectData(folder_id , report_id);

    ProjectStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {


    var heading, body, items, report_components, loaded;

    loaded = this.state.loaded
    // FIXME: Rename 'reportData'
    if ( this.state.projectData ){
        loaded = true
        heading = this.state.projectData.title;
        body = this.state.projectData.body;
        items = this.state.projectData.items;

        report_components = (
          <Panel heading={ heading } body={ body } >
              <Dashboard items={items}/>
          </Panel>
        );
    }

    return (
      
        <div>
          <Loader loaded={loaded}>
            {report_components}
          </Loader>
        </div>
      
    )
  }
});

module.exports = Report;