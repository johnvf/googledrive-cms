var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var IndexRoute = routerModule.IndexRoute;
var Redirect = routerModule.Redirect;

var createBrowserHistory = require('history/lib/createBrowserHistory');
var useBasename = require('history/lib/useBasename')

var LoginStore = require( './stores/LoginStore')

var ViewActions = require('./actions/ViewActions');

var Navbar = require( './components/Navbar')
var Sidebar = require( './components/Sidebar')

// Pages
var Login = require( './pages/Login'),
    Logout = require( './pages/Logout'),
    Landing = require('./pages/Landing'),
    Report = require('./pages/Report');


function getStateFromStores() {
  return {
    loggedIn: LoginStore.loggedIn(),
  };
}


var App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  },

  updateAuth: function(loggedIn) {
    this.setState({
      loggedIn: !!loggedIn
    });
  },

  render: function () {
    var loggedIn = this.state.loggedIn

    return (
      <div className="main">
        <Navbar loggedIn={ loggedIn }/>
        <Sidebar loggedIn={ loggedIn }/>
        <div className="container-fluid centered">
          {this.props.children}
        </div>

      </div>
    );
  }
});


function requireAuth(locationObj, replaceState) {
  if (!LoginStore.loggedIn()){

    replaceState({ nextPathname: locationObj.location.pathname }, '/login');

  }
}

const history = useBasename(createBrowserHistory)({
  basename: ''
})

// React-Router route configuration
// Essentially a mini-sitemap used to direct users to different pages
React.render((
  <Router history={ history } >
    <Route path="/" component={App}>
      <IndexRoute component={Landing} onEnter={requireAuth} />
      <Route path="/project/:project_id/:report_id" component={Report} onEnter={requireAuth}/>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
    </Route>
  </Router>
), document.body);