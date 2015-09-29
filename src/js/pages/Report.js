var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')

var Project = require('../components/Project')

function getStateFromStores() {
  return {
    report: ProjectStore.getReport(),
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
    
    var { folder_id, report_id } = this.props.params;
    ViewActions.getReport(folder_id , report_id);
  },

  componentWillReceiveProps: function(nextProps){
    var { folder_id, report_id } = nextProps.params;
    ViewActions.getReport(folder_id , report_id);
  },

  _onChange: function() {
    if(this.isMounted()) {
      this.setState(getStateFromStores());
    }
  },

  render: function() {

    var { folder_id, report_id } = this.props.params;

    var heading, body, items, report_components, loaded;

    loaded = this.state.loaded
    // FIXME: Rename 'reportData'
    if ( this.state.report ){
        loaded = true
        heading = this.state.report.title;
        body = this.state.report.body;
        items = this.state.report.items;

        report_components = (
          <Panel heading={ heading } body={ body } >
              <Dashboard  items={items} 
                          onLoad={ ViewActions.getReportLayout.bind(null, folder_id, report_id) } 
                          onSave={ ViewActions.saveReportLayout.bind(null, folder_id, report_id) } 
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