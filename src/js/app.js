var React = require('react');

var routerModule = require('react-router');
var Router = routerModule.Router;
var Route = routerModule.Route;
var Link = routerModule.Link;
var History = routerModule.History;
var DefaultRoute = routerModule.DefaultRoute;

var LoginStore = require( './stores/LoginStore')
// FIXME: Perhaps this ought to be a store?
var Auth = require('./utils/Auth.js')

var Navbar = require( './components/Navbar')

// Pages
var Login = require( './pages/Login'),
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
    return (
      <div className="main">
        <Navbar/>
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

React.render((
  <Router>
    <Route path="/" component={App}>
        <Route name="login" component={Login} />
        <Route name="landing" component={Landing} onEnter={requireAuth}/>
        <Route name="project" component={Project}/> 
    </Route>
  </Router>
), document.body);

// var routes = (
//   <Route path="/projects" handler={App}>
//       <Route name="login" handler={Login} />
//       <Route name="landing" handler={Landing} onEnter={requireAuth}/>
//       <Route name="project" handler={Project} onEnter={requireAuth}/> 
//       <DefaultRoute handler={Landing} />
//   </Route>
// );

// Router.run(routes,(Root) => {
//   React.render(<Root/>, document.body);
// });

// var routes = (
//   <Route path="/projects" handler={App}>
//       <Route name="login" handler={Login} />
//       <Route name="landing" handler={Landing} onEnter={requireAuth}/>
//       <Route name="project" handler={Project} onEnter={requireAuth}/> 
//       <DefaultRoute handler={Landing} />
//   </Route>
// );

// Router.run(routes, Router.HistoryLocation, function (Handler) {
//   React.render(<Handler/>, document.body);
// });