var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var IndexRoute = routerModule.IndexRoute;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var LoginStore = require( './stores/LoginStore')
var ViewActions = require('./actions/ViewActions');

var Navbar = require( './components/Navbar')

// Pages
var Login = require( './pages/Login'),
    Logout = require( './pages/Logout'),
    Landing = require('./pages/Landing'),
    Project = require('./pages/Project');


function getStateFromStores() {
  return {
    loggedIn: LoginStore.loggedIn()
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
        <Navbar loggedIn={getStateFromStores().loggedIn}/>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
});

function requireAuth(nextState, redirectTo) {
  if (!LoginStore.loggedIn()){
    // FIXME: This is supposed to redirect to the original url on login, doesn't quite work
    redirectTo('/login', '/login', { nextPathname: nextState.location.pathname });
  }
}

var BrowserHistory = createBrowserHistory();


React.render((
  <Router history={ BrowserHistory } >
    <Route path="/" component={App}>
      <IndexRoute component={Login} />
      <Route path="login" component={Login} />
      <Route path="landing" component={Landing} onEnter={requireAuth}/>
      <Route path="project" component={Project} onEnter={requireAuth}/> 
      <Route path="logout" component={Logout} />
    </Route>
  </Router>
), document.body);