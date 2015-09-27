var React = require('react');

var Table = React.createClass({

    render: function(){
        return <div id={this.props.id}>{ this.props.item.body }</div>
    }
});

module.exports = Table