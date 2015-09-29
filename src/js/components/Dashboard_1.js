var React = require('react');
// Some considerations with grid layout:
// - What do we do if the user makes a layout, then adds an additional widget without redoing the layout?
// - Standard keys vs. custom keys? Maybe custom keys, since they're more explicit?
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

var Text = require('../lib_components/Text');
var Table = require('../lib_components/Table');
var Chart = require('../lib_components/Chart');


var Report = React.createClass({

  getDefaultProps: function() {
    var ls = {};
    if (localStorage) {
      try {
        ls = JSON.parse(localStorage.getItem( this.props.report_id )) || {};
      } catch(e) {}
    }
    return {
      className: "layout",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 30,
      layouts: ls.layouts || {}
    };
  },


  componentDidUpdate: function(prevProps, prevState) {
    this._saveToLocalStorage();
  },

  resetLayout: function() {
    this.setState({layout: []});
  },

  _saveToLocalStorage: function() {
    if (localStorage) {
      localStorage.setItem( this.props.report_id , JSON.stringify({
        layouts: this.state.layouts
      }));
    }
  },


  onLayoutChange: function(layout, layouts) {
    if( this.props.onLayoutChange ){
      this.props.onLayoutChange(layout);
    }
    this.setState({layout: layout, layouts: layouts});
  },

  getWidgets: function( items ){
    widgets = []

    var self = this;

    Object.keys(items).forEach( function(item_id, i){

      var item = items[ item_id ];

      switch (item.type) {
        case "text":
          widgets.push( <div key={i}><Text id={item_id} item={item}/></div> )
          break;

        case "table":
          widgets.push( <div key={i}><Table id={item_id} item={item}/></div> )
          break;

        case "chart":
          widgets.push( <div key={i} ><Chart id={item_id} item={item}/></div> )
          break;
      }

    });

    return widgets
  },

  render: function(){

      var widgets = this.getWidgets( this.props.items );

      // {lg: layout1, md: layout2, ...}
      return (    
          <div className="container-fluid">
            <ResponsiveReactGridLayout className="layout"
              {...this.props}
              onLayoutChange={this.onLayoutChange}>
              {widgets}
            </ResponsiveReactGridLayout>
          </div>
      )      
  }

});


module.exports = Report