var React = require('react');
var History = require('react-router').History;

var ViewActions = require('../actions/ViewActions');

var Login = React.createClass({

  mixins: [ History ],
  
  getInitialState: function() {
    return {user: "", password: "", error: false };
  },

  // This will be called when the user clicks on the login button
  login: function(e) {
    e.preventDefault();
    ViewActions.login(this.state.user, this.state.password, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true });

      var { location } = this.props;

      console.log(this.history)
      console.log(location);
      console.log(location.state);

      if (location.state && location.state.nextPathname) {
        console.log( "location state found")
        console.log("redirecting to: "+location.state.nextPathname)
        this.history.replaceState(null, location.state.nextPathname);
      } else {
        console.log( "no location state found")
        this.history.replaceState(null, '/');
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
    console.log("login")
    return (
      <form className="form-signin login-fields">
        <h3 className="form-signin-heading">Welcome to the Hyphae <br/> Reports Portal</h3> 
        <h4 className="form-signin-heading">Please sign in below:</h4> 
        <label for="inputEmail" className="sr-only">Email address</label>
        <input id="inputUser" className="form-control" onChange={this.changeUser} value={this.state.user} placeholder="Username" required="" autofocus=""/>
        <label for="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" onChange={this.changePassword} value={this.state.password} placeholder="Password" required=""/>
        <button className="btn btn-lg btn-default btn-block btn-login" type="submit" onClick={this.login.bind(this)}>Sign in</button>
        <p className="form-signin-heading">
          {"This page only works in modern browsers & may not work on all mobile devices. If you aren't already, consider viewing with"}
          <a href="https://www.google.com/chrome/browser"> "Chrome" </a>
        </p> 
      </form>
      )
  }

});

module.exports = Login