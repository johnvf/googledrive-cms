var React = require('react');

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map( function(token, i) {
        if( token.match(urlRegex) ){
          var clean_url = token.replace(/^[.\s]+|[.\s]+$/g, "");
          return (<a href={clean_url}> { token } </a>);
        }
        else{
          return ( token );
        }
    })
}


var Text = React.createClass({

    render: function(){
        return <div id={this.props.id}>{ urlify(this.props.item.body) }</div>
    }
});

module.exports = Text