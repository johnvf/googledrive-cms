var React = require('react');

var WebAPIUtils = require('../utils/WebAPIUtils');

var Login = React.createClass({
  getInitialState: function() {
    return {user: "foo", password: "bar"};
  },

  // This will be called when the user clicks on the login button
  login: function(e) {
    e.preventDefault();
    // Here, we call an external AuthService. We’ll create it in the next step
    WebAPIUtils.login(this.state.user, this.state.password);
  },

  changeUser: function(e){ 
    this.setState({user: e.target.value})
  },

  changePassword: function(e){ 
    this.setState({password: e.target.value})
  },

  render: function() {
    return (
      <div>
        <form className="form-group">
          <input type="text" onChange={this.changeUser} value={this.state.user} placeholder="Username" />
          <input type="text" onChange={this.changePassword} value={this.state.password} placeholder="Password" />
          <button type="submit" onClick={this.login.bind(this)}>Submit</button>
        </form>
      </div>
    )
  }

});

module.exports = Login