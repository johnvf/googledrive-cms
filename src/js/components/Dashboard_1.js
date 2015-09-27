var React = require('react');
// Some considerations with grid layout:
// - What do we do if the user makes a layout, then adds an additional widget without redoing the layout?
// - Standard keys vs. custom keys? Maybe custom keys, since they're more explicit?
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

var Text = require('../lib_components/Text');
var Table = require('../lib_components/Table');
var Chart = require('../lib_components/Chart');


function getWidgets( items ){
  widgets = []
  Object.keys(items).forEach( function(item_id){

    var item = items[ item_id ];

    switch (item.type) {
      case "text":
        widgets.push( <Text key={item_id} id={item_id} item={item}/> )
        break;

      case "table":
        widgets.push( <Table key={item_id} id={item_id} item={item}/> )
        break;

      case "chart":
        widgets.push( <Chart key={item_id} id={item_id} item={item}/> )
        break;
    }

  });

  return widgets
}

var Report = React.createClass({

    render: function(){

        var widgets = getWidgets( this.props.items );

        // {lg: layout1, md: layout2, ...}
        var layouts = getLayoutsFromSomewhere();

        return (    
            <div className="container-fluid">
              <ResponsiveReactGridLayout className="layout" layouts={layouts}
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
                { widgets }
              </ResponsiveReactGridLayout>
            </div>
        )      
    }

});


module.exports = Report