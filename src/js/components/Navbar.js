var React = require('react');
var DropdownButton = require('react-bootstrap/lib/DropdownButton');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var Link = require('react-router').Link;

var ProjectStore = require('../stores/ProjectStore')

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
      <DropdownButton style={{float: "left", marginTop: "4px"}} bsStyle={title.toLowerCase()} title={title} key={i} id={`dropdown-basic-${i}`} >
        { menuItems }
      </DropdownButton>
    );
  },

  render: function() {

    var loggedIn = this.props.loggedIn;
    var dropdown;

    if( this.state.projects ){
      dropdown = this.renderDropdownButton(  "Projects", 0 , this.state.projects );
    }

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
      items = [
        dropdown,
        (<li> <Link to={ "/" }>{ "Home" }</Link> </li>),
        (<li> <Link to={ "/logout" }>{ "Logout" }</Link> </li>)
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