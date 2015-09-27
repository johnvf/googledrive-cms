var React = require('react');

var Text = require('../lib_components/Text');
var Table = require('../lib_components/Table');
var Chart = require('../lib_components/Chart');


function getWidgets( items ){
  widgets = {}
  Object.keys(items).forEach( function(item_id){

    var item = items[ item_id ];

    switch (item.type) {
      case "text":
        widgets[item_id] = <Text id={item_id} item={item}/>
        break;

      case "table":
        widgets[item_id] = <Table id={item_id} item={item}/>
        break;

      case "chart":
        widgets[item_id] = <Chart id={item_id} item={item}/>
        day = "table";
        break;
    }

  });

  return widgets
}

var Report = React.createClass({

    render: function(){

        var widgets = getWidgets( this.props.items );

        var text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus."


        // NOTE: If we only wan't to support a repeating, staggered pattern (like below), this could be generalized.
        // Right now, the assumption is that there is a single template with a max. size + non-repeating layout.
        return (    
            <div className="container-fluid">

                <div className="row">
                  <div className="col-8">
                     { widgets["A"] }
                  </div>
                  <div className="col-4">
                    { widgets["B"] }
                  </div>
                </div>


                <div className="row">
                  <div className="col-4">
                    { widgets["C"] }
                  </div>
                  <div className="col-8">
                    { widgets["D"] }
                  </div>
                </div>

                <div className="row">
                  <div className="col-8">
                    { widgets["E"] }
                  </div>
                  <div className="col-4">
                    { widgets["F"] }
                  </div>
                </div>

            </div>
        )
    }
});


module.exports = Report