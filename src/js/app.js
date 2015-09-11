var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var Redirect = Router.Redirect;
var RouteHandler = Router.RouteHandler;

var SessionStore = require( './stores/SessionStore')
var Navbar = require( './components/Navbar')

// Pages
var Login = require( './pages/Login'),
    Landing = require('./pages/Landing'),
    Project = require('./pages/Project');


function getStateFromStores() {
  return {
    loggedIn: SessionStore.getLoggedIn()
  };
}

var App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function () {
    loggedIn = this.state.loggedIn;

    return (
      <div className="main">
        <Navbar loggedin={ loggedIn }/>
        <div className="container-fluid">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route path="/projects" handler={App}>
      <Route name="login" handler={Login} />
      <Route name="landing" handler={Landing} />
      <Route name="project" handler={Project} /> 
      <DefaultRoute handler={Landing} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});