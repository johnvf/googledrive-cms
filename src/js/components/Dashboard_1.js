var React = require('react');
// Some considerations with grid layout:
// - What do we do if the user makes a layout, then adds an additional widget without redoing the layout?
// - Standard keys vs. custom keys? Maybe custom keys, since they're more explicit?
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

var Text = require('../lib_components/Text');
var Table = require('../lib_components/Table');
var Chart = require('../lib_components/Chart');


var Report = React.createClass({

   getInitialState: function() {
      var layout = this.getLayout();
      return {
        layout: layout
      };
    },

    onResizeStop: function( layout ){
      console.log(layout);
      this.setState({ layout: { lg: layout} })
    },

    getLayout: function(){

      // TODO: Get layout from google drive

      // if layout is undefined, make layout:
      var layout
      if( this.props.items ){
        layout = Object.keys( this.props.items ).map(function(item, i){
          return {h: 2 , i: String(i) , w: 5 , x: 0 , y: i}
        })
      }
      return {lg: layout }
    },

    getWidgets: function( items ){
      widgets = []

      var self = this;
      var layout = this.state.layout

      Object.keys(items).forEach( function(item_id, i){

        var item = items[ item_id ];

        switch (item.type) {
          case "text":
            widgets.push( <div key={i}><Text layout={layout} id={item_id} item={item}/></div> )
            break;

          case "table":
            widgets.push( <div key={i}><Table layout={layout} id={item_id} item={item}/></div> )
            break;

          case "chart":
            widgets.push( <div key={i} ><Chart layout={layout} id={item_id} item={item}/></div> )
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
              <ResponsiveReactGridLayout className="layout" layouts={this.state.layout}
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                isDraggable={true}
                isResizable={true}
                onResizeStop={ this.onResizeStop }>
                {widgets}
              </ResponsiveReactGridLayout>
            </div>
        )      
    }

});


module.exports = Report