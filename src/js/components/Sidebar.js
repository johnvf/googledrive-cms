var React = require('react');

var Link = require('react-router').Link;
var Tree = require('react-ui-tree');

function makeTree(projects){
	var tree = { text: "Projects", href:'/' }

	tree.children = projects.map( function(project){
		project_tree = { text: project.config.properties.name,  href:'/' }

		var folder_id = project.folder
		var project_reports = project.config.reports

		project_tree.children = Object.keys( project_reports ).map( function( report_id ){

			var report = project_reports[report_id]
			report_tree = { text: report.title , href: '/project/'+ folder_id +'/'+ report_id }

			return report_tree
		})

		return project_tree
	});


	return tree
}

var Sidebar = React.createClass({

getInitialState: function() {
    return {
      active: null,
      tree: null
    };
  },

  componentWillReceiveProps: function(nextProps){
  	if ( nextProps.projects ){
		this.setState({
			tree: makeTree(nextProps.projects)
		});		
  	}
  },

  handleChange: function(tree) {
    this.setState({
      tree: tree
    });
  },

 //  renderNode: function(item){
	// return( <li> <a href={ item.href }>{ item.text }</a> </li> )
 //  },

  renderNode: function(item){
	return(  <Link to={item.href }>{ item.text}</Link> )
  },

  render: function() {
  	// var items = this.props.items

    // FIXME: 
    // If props.projects is empty, 
    // the navbar should be given a callback to call to get the items
    //
    // Right now, if the navbar loads directly from a report that is accessed, it will not have items, 
    // since the call to load items happens in the landing page

	// If loggedIn, show the sidebar. Else, hide
	if( this.props.loggedIn && this.state.tree ){
	    return (
	      <div className="col-xs-2 sidebar">
	          <Tree
	            paddingLeft={ 20 }
	            tree={ this.state.tree }
	            onChange={ this.handleChange }
	            isNodeCollapsed={ this.isNodeCollapsed }
	            renderNode={ this.renderNode }
	          />
	      </div>
	    );	
	}
	else{
		return null
	}

  }
});


 //  render: function() {
 //  	// var items = this.props.items

 //  	items = [ { target: "foo", text: "bar"}, { target: "foo2", text: "bar2"}, { target: "fo3o", text: "ba3r"}]

	// var itemMarkup = items.map(function(item){
	// 	return <li> <a href={ item.target }>{ item.text }</a> </li>
	// });

	// // If loggedIn, show the sidebar. Else, hide
	// if( this.props.loggedIn ){
	//     return (
	//       <div className="col-xs-2 sidebar">
	      
	// 		<ul className="nav nav-sidebar">
	// 			{ itemMarkup }
	// 			<li>
	// 				<ul className="nav nav-sidebar">
	// 					{ itemMarkup }
	// 		        </ul>
	// 			</li>
	//         </ul>
	//       </div>
	//     );	
	// }
	// else{
	// 	return null
	// }

 //  }

module.exports = Sidebar;