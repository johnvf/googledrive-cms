var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var Redirect = Router.Redirect;
var RouteHandler = Router.RouteHandler;


var WebAPIUtils = require('./utils/WebAPIUtils');

// Pages
var Landing = require('./pages/Landing.react'),
    Reports = require('./pages/Reports.react')

var App = React.createClass({

  componentDidMount: function(){
    WebAPIUtils.getProject("Eden Housing");
  },

  render: function () {

    return (
      <div className="main">
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
    <Route handler={App}>
        <Route name="landing" path="/" handler={Landing} />
        <Route name="reports" path="/reports" handler={Reports} />
        <DefaultRoute handler={Landing}/>   
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});