var React = require('react');
var Link = require('react-router').Link;

var Navbar = React.createClass({

    render: function() {

      var loggedIn = this.props.loggedIn;
      var items;

      if ( loggedIn == false ){
        items = [
        { text: "Login", target: "/login" },
        ]
      }
      else {
        items = [
        { text: "Home", target: "/landing" },
        { text: "Project", target: "/project" },
        { text: "Logout", target: "/logout" }
        ]
      }

    var itemMarkup = items.map( function (menuItem){ 
      if( typeof(menuItem) === "object"){
        return (
          <li> <Link to={ menuItem.target }>{ menuItem.text }</Link> </li>   
        )
      }
      else{
        return  <li> <a>{ "test" }</a> </li>   
      }
    })

      return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">BRAND</a>
          </div>
        <ul className="nav navbar-nav navbar-right">
          { itemMarkup }
        </ul>
        </div>
      </div>
    )
  }
});

module.exports = Navbar;