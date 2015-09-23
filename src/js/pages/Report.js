var React = require('react');

var Panel = require('../lib_components/Panel')

// Components
var Dashboard = require('../components/Dashboard_1');

var Report = React.createClass({

  render: function() {
    var { folder_id, report_id } = this.props.params;

    console.log(folder_id);
    console.log(report_id);

    var heading = "My Report";
    var body = "Some report text"

    return (
    <div>
        <Panel heading={ heading } body={ body } >
            <Dashboard/>
        </Panel>
    </div>
    )
  }
});

module.exports = Report;