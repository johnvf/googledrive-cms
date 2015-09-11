var React = require('react');
var Auth = require('../utils/Auth.js');

var Logout = React.createClass({
  componentDidMount() {
    Auth.logout();
  },

  render() {
    return <p>You are now logged out</p>;
  }
});