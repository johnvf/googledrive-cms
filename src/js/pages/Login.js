var React = require('react');
var History = require('react-router').History;

var ViewActions = require('../actions/ViewActions');

var Login = React.createClass({

  mixins: [ History ],
  
  getInitialState: function() {
    return {user: "tk421", password: "Changeme1", error: false };
  },

  // This will be called when the user clicks on the login button
  login: function(e) {
    e.preventDefault();
    ViewActions.login(this.state.user, this.state.password, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true });

      var { location } = this.props;

      if (location.state && location.state.nextPathname) {
        this.history.replaceState(null, location.state.nextPathname);
      } else {
        this.history.replaceState(null, '/landing');
      }
    });
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
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    )
  }

});

module.exports = Login