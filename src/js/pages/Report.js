var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')

var Project = require('../components/Project')

function getStateFromStores() {
  return {
    report: ProjectStore.getReport(),
    layouts: ProjectStore.getReportLayouts(),
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
    ProjectStore.addChangeListener(this._onChange);
    
    var { project_id, report_id } = this.props.params;
    ViewActions.getReport(project_id , report_id);
    ViewActions.getReportLayouts(project_id, report_id);
  },

  componentWillReceiveProps: function(nextProps){
    var { project_id, report_id } = nextProps.params;
    ViewActions.getReport(project_id , report_id);
  },

  _onChange: function() {
    if(this.isMounted()) {
      this.setState(getStateFromStores());
    }
  },

  render: function() {

    var { project_id, report_id } = this.props.params;

    var heading, body, items, layouts, report_components, loaded;

    loaded = this.state.loaded
    // FIXME: Rename 'reportData'
    if ( this.state.report ){
        loaded = true
        heading = this.state.report.title;
        items = this.state.report.items;
        layouts = this.state.layouts

        report_components = (
          <Panel heading={ heading } >
              <Dashboard  items={items} 
                          report_id={report_id}
                          layouts={ layouts }
                          onSave={ ViewActions.saveReportLayouts.bind(null, project_id, report_id) } 
              />
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