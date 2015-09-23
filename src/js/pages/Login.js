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

  changeUser: function(e){ 
    this.setState({user: e.target.value})
  },

  changePassword: function(e){ 
    this.setState({password: e.target.value})
  },

  render: function(){
    return (
      <form className="form-signin centered">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label for="inputEmail" className="sr-only">Email address</label>
        <input id="inputUser" className="form-control" onChange={this.changeUser} value={this.state.user} placeholder="Username" required="" autofocus=""/>
        <label for="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" onChange={this.changePassword} value={this.state.password} placeholder="Password" required=""/>
        <button className="btn btn-lg btn-default btn-block" type="submit" onClick={this.login.bind(this)}>Sign in</button>
      </form>
      )
  }

});

module.exports = Login