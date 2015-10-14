var React = require('react');
var DropdownButton = require('react-bootstrap/lib/DropdownButton');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var Link = require('react-router').Link;

// function renderDropdownButton(title, i) {
//   return (
//     <DropdownButton style={{float: "right", marginTop: "4px"}} bsStyle={title.toLowerCase()} title={title} key={i} id={`dropdown-basic-${i}`}>
//       <MenuItem eventKey="1">Action</MenuItem>
//       <MenuItem eventKey="2">Another action</MenuItem>
//       <MenuItem eventKey="3" active>Active Item</MenuItem>
//       <MenuItem divider />
//       <MenuItem eventKey="4">Separated link</MenuItem>
//     </DropdownButton>
//   );
// }

var Navbar = React.createClass({

  renderDropdownButton: function(title, i) {
    return (
      <DropdownButton style={{float: "right", marginTop: "4px"}} bsStyle={title.toLowerCase()} title={title} key={i} id={`dropdown-basic-${i}`} >
        <MenuItem header>Header</MenuItem>
        <MenuItem eventKey={1}>Action</MenuItem>
        <MenuItem eventKey={2}>Another action</MenuItem>
        <MenuItem eventKey={3} active>Active Item</MenuItem>
        <MenuItem divider />
        <MenuItem header>Header</MenuItem>
        <MenuItem eventKey={4}>Separated link</MenuItem>
        <li> <Link to={ "/" }>{ "Home" }</Link> </li>
        <MenuItem divider />
      </DropdownButton>
    );
  },

  render: function() {

    var loggedIn = this.props.loggedIn;
    var items;

    var navbarClassName = "navbar-default navbar-fixed-top"
    var brandClassName = "navbar-brand"

    if ( loggedIn == false ){
      items = [
        (<li> <Link to={ "/login" }>{ "Login" }</Link> </li>),
      ],
      navbarClassName += " logged-out"
      brandClassName += " logged-out"
    }
    else {
      var dropdown = this.renderDropdownButton( "Projects", 0)
      items = [
        (<li> <Link to={ "/" }>{ "Home" }</Link> </li>),
        (<li> <Link to={ "/logout" }>{ "Logout" }</Link> </li>),
        ( dropdown )
      ]
    }

    return (
      <div className={navbarClassName} role="navigation">
        <div className="container">
          <div className="navbar-header">
            <a className={brandClassName} href="#"><img src="http://s10.postimg.org/cahd4z6d5/hyphae_logo_white.png"/>
            </a>
          </div>
        <ul className="nav navbar-nav navbar-right">
          { items }
        </ul>
        </div>
      </div>
    )
  }

});

module.exports = Navbar;