var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var IndexRoute = routerModule.IndexRoute;
var Redirect = routerModule.Redirect;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var ProjectStore = require('./stores/ProjectStore')
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
    projects: ProjectStore.getProjects()
  };
}


var App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },
  componentWillMount: function() {
    ViewActions.login();
  },
  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
    ProjectStore.addChangeListener(this._onChange);
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
    var projects = this.state.projects
    return (
      <div className="main">
        <Navbar loggedIn={ loggedIn }/>
        <Sidebar loggedIn={ loggedIn } projects={ projects } />
        <div className="container-fluid centered">
          {this.props.children}
        </div>

      </div>
    );
  }
});

function requireAuth(nextState, redirectTo) {
  if (!LoginStore.loggedIn()){
    console.log( LoginStore.loggedIn() );
    // FIXME: This is supposed to redirect to the original url on login, doesn't quite work
    // redirectTo('/login', '/login', { nextPathname: nextState.location.pathname });
    BrowserHistory.replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

var BrowserHistory = createBrowserHistory();

// React-Router route configuration
// Essentially a mini-sitemap used to direct users to different pages
React.render((
  <Router history={ BrowserHistory } >
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="project/:folder_id/:report_id" component={Report} onEnter={requireAuth}/>
      <Route path="landing" component={Landing} onEnter={requireAuth}/>
      <Redirect from="*" to="/landing"/>
    </Route>
  </Router>
), document.body);