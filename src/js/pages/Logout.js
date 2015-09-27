var React = require('react');
var ViewActions = require('../actions/ViewActions');

var Logout = React.createClass({
  componentDidMount() {
    ViewActions.logout();
  },

  render() {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout