var React = require('react');

var Loader = require('react-loader');

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')
var LoginStore = require('../stores/LoginStore');

var Project = require('../components/Project')

function getStateFromStores( project_id, report_id  ) {
  return {
    report: ProjectStore.getReport( project_id, report_id  ),
    layouts: ProjectStore.getReportLayouts( project_id, report_id  ),
    user: LoginStore.getUser(),
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
    var { project_id, report_id } = this.props.params;    
    return getStateFromStores( project_id, report_id);
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);  
    LoginStore.addChangeListener(this._onChange);  
  },

  componentWillReceiveProps: function(nextProps){
    if( nextProps.params.report_id != this.props.params.report_id ){
      console.log("report changed")
      var { project_id, report_id } = nextProps.params;
      this.setState(getStateFromStores( project_id, report_id ));
    }
  },

  _onChange: function() {
    if(this.isMounted()) {
      var { project_id, report_id } = this.props.params;    
      this.setState(getStateFromStores( project_id, report_id ));
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

        var editable = false;
        if( !!this.state.user){
          if( Array.isArray(this.state.user.groupData) == true ){
            if ( this.state.user.groupData.indexOf("admin") != -1 ){
              editable = true;
            }
          }
        }

        report_components = (
          <Panel heading={ heading } >
              <Dashboard  items={items} 
                          report_id={report_id}
                          layouts={ layouts }
                          onSave={ ViewActions.saveReportLayouts.bind(null, project_id, report_id) } 
                          editable={ editable }
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