var React = require('react');
var NavBar = require('react-bootstrap/lib/Navbar');
var Nav = require('react-bootstrap/lib/Nav');
var CollapsibleNav = require('react-bootstrap/lib/CollapsibleNav');
var NavItem = require('react-bootstrap/lib/NavItem');
var NavDropdown = require('react-bootstrap/lib/NavDropdown');
var NavBrand = require('react-bootstrap/lib/NavBrand');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var Link = require('react-router').Link;

var ProjectStore = require('../stores/ProjectStore')

function getStateFromStores() {
  return {
    projects: ProjectStore.getProjects()
  };
}

var Navbar = React.createClass({

  getInitialState: function() {
      return {}
  },

  componentDidMount: function() {
      ProjectStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState( getStateFromStores() );
  },

  renderDropdownButton: function(title, i, projects) {

    var menuItems = []

    projects.forEach( function(project){
        var project_id = project.project_id

        menuItems.push( <MenuItem header>{ project.config.properties.name }</MenuItem> )

        Object.keys(project.config.reports).forEach( function(report_id){
          var report = project.config.reports[report_id]
          menuItems.push( <li> <Link to={ '/project/'+ project_id +'/'+ report_id }>{ report.title } </Link> </li> )
        })

        menuItems.push( <MenuItem divider />)
    })

    return (
      <NavDropdown bsStyle={title.toLowerCase()} title={title} key={i} id={`dropdown-basic-${i}`} >
        { menuItems }
      </NavDropdown>
    );
  },

  render: function() {

    var loggedIn = this.props.loggedIn;
    var dropdown;

    if( this.state.projects ){
      dropdown = this.renderDropdownButton(  "Projects", 0 , this.state.projects );
    }

    var navbarClassName;
    var brandClassName;

    if ( loggedIn == false ){
      items = [
        (<NavItem> <Link to={ "/login" }>{ "Login" }</Link> </NavItem>),
      ],
      navbarClassName = "logged-out"
      brandClassName = "logged-out"
    }
    else {
      items = [
        dropdown,
        (<NavItem> <Link to={ "/" }>{ "Home" }</Link> </NavItem>),
        (<NavItem> <Link to={ "/logout" }>{ "Logout" }</Link> </NavItem>)
      ]
    }

    return (
      <NavBar className={navbarClassName} toggleNavKey={0}>
        <NavBrand>
          <a className={brandClassName} href="#"><img src="http://s10.postimg.org/cahd4z6d5/hyphae_logo_white.png"/>
          </a>
        </NavBrand>
        <CollapsibleNav eventKey={0}>
          <Nav navbar right>
            { items }
          </Nav>
        </CollapsibleNav>
      </NavBar>
    )
  }

});

module.exports = Navbar;