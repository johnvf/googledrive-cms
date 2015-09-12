var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var LoginStore = require( './stores/LoginStore')
// FIXME: Perhaps this ought to be a store?
var Auth = require('./utils/Auth.js')

var Navbar = require( './components/Navbar')

// Pages
var Login = require( './pages/Login'),
    Logout = require( './pages/Logout'),
    Landing = require('./pages/Landing'),
    Project = require('./pages/Project');


function getStateFromStores() {
  return {
    loggedIn: Auth.loggedIn()
  };
}


var App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },
  componentWillMount: function() {
    Auth.onChange = this.updateAuth;
    Auth.login();
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
        <Navbar loggedIn={loggedIn}/>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
});

function requireAuth(nextState, redirectTo) {
  if (!Auth.loggedIn())
    redirectTo('/login', null, { nextPathname: nextState.location.pathname });
}

var BrowserHistory = createBrowserHistory();

React.render((
  <Router history={ BrowserHistory } >
    <Route path="/" component={App}>
        <Route path="login" component={Login} />
        <Route path="landing" component={Landing}/>
        <Route path="project" component={Project} onEnter={requireAuth}/> 
        <Route path="logout" component={Logout} />
    </Route>
  </Router>
), document.body);