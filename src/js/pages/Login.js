var React = require('react');
var Router = require('react-router');
var { Link } = Router;

var ViewActions = require('../actions/ViewActions');

var Login = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },
  
  getInitialState: function() {
    return {user: "tk421", password: "Changeme1"};
  },

  // This will be called when the user clicks on the login button
  login: function(e) {
    e.preventDefault();
    ViewActions.logIn(this.state.user, this.state.password);
  },

  logout: function(e) {
    ViewActions.logOut();
  },

  changeUser: function(e){ 
    this.setState({user: e.target.value})
  },

  changePassword: function(e){ 
    this.setState({password: e.target.value})
  },

  render: function() {
    return (
      <form className="form-group">
        <input type="text" onChange={this.changeUser} value={this.state.user} placeholder="Username" />
        <input type="text" onChange={this.changePassword} value={this.state.password} placeholder="Password" />
        <button type="submit" onClick={this.login.bind(this)}>Submit</button>
        <button onClick={this.logout.bind(this)}>Logout</button>
      </form>
    )
  }

});

module.exports = Login