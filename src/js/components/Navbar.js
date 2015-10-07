var React = require('react');
var Link = require('react-router').Link;

var Navbar = React.createClass({

    render: function() {

      var loggedIn = this.props.loggedIn;
      var items;

      var navbarClassName = "navbar-default navbar-fixed-top"
      var brandClassName = "navbar-brand"

      if ( loggedIn == false ){
        items = [
        { text: "Login", target: "/login" },
        ],
        navbarClassName += " logged-out"
        brandClassName += " logged-out"
      }
      else {
        items = [
        { text: "Home", target: "/" },
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
      <div className={navbarClassName} role="navigation">
        <div className="container">
          <div className="navbar-header">
            <a className={brandClassName} href="#"><img src="http://s10.postimg.org/cahd4z6d5/hyphae_logo_white.png"/>
            </a>
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