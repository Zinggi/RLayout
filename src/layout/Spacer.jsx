'use strict';

var React = require('react/addons');
var Layout = require('./Layout');

var Spacer = React.createClass({
    getDefaultProps() {
        return { size: "weight 1" };
    },
    render() {
        var {children, ...newProps} = this.props;
        return (
            <Layout {...newProps} dontRender />
        );
    }
});

module.exports = Spacer;