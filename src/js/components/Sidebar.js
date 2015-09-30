var React = require('react');
var Link = require('react-router').Link;

var ViewActions = require('../actions/ViewActions');
var ProjectStore = require('../stores/ProjectStore')


function makeTree(projects){
	var tree = { text: "Projects", href:'/' }

	tree.items = projects.map( function(project){
		project_tree = { text: project.config.properties.name,  href:'/' }

		var project_id = project.project_id
		var project_reports = project.config.reports

		project_tree.items = Object.keys( project_reports ).map( function( report_id ){

			var report = project_reports[report_id]
			report_tree = { text: report.title , href: '/project/'+ project_id +'/'+ report_id }

			return report_tree
		})

		return project_tree
	});


	return tree
}


function getStateFromStores() {
  return {
    projects: ProjectStore.getProjects()
  };
}

var SidebarNode = React.createClass({

    render: function(){

        var itemMarkup;

        if( this.props.items ){
            itemMarkup = this.props.items.map(function(item){
                var childNode;
                if( item.items ){
                     childNode = <SidebarNode items={ item.items }/>
                }
                return( 
                    <li> 
                        <Link to={item.href }>{ item.text}</Link>
                        {childNode} 
                    </li> 
                )
            });
        }

        return(
            <ul className="nav nav-sidebar">
                { itemMarkup }
            </ul>
        )
    }

})

var Sidebar = React.createClass({

    getInitialState: function() {
        return getStateFromStores()
    },

    componentDidMount: function() {
        ProjectStore.addChangeListener(this._onChange);
        if (!this.state.projects && this.props.loggedIn ){
            ViewActions.getProjects();
        }
    },

    _onChange: function() {
        this.setState( getStateFromStores() );
    },

    render: function() {

        // FIXME: 
        // If props.projects is empty, 
        // the navbar should be given a callback to call to get the items
        //
        // Right now, if the navbar loads directly from a report that is accessed, it will not have items, 
        // since the call to load items happens in the landing page

        // If loggedIn, show the sidebar. Else, hide
        var items;
        if( this.state.projects ){
            items = makeTree( this.state.projects ).items;
        }

        if( this.props.loggedIn ){
            return (
              <div className="col-xs-2 sidebar">
                <SidebarNode items={ items }/>
              </div>
            );	
        }
        else{
        	return null
        }

    }
});

module.exports = Sidebar;