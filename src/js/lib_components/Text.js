var React = require('react');

var Text = React.createClass({

    render: function(){
        return <div id={this.props.id}>{ this.props.item.body }</div>
    }
});

module.exports = Text