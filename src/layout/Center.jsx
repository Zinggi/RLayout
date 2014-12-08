'use strict';

var React = require('react/addons');
var CenterHorizontal = require('./CenterHorizontal');
var CenterVertical = require('./CenterVertical');

var Center = React.createClass({
    getDefaultProps() {
        return {
            contentWidth: "weight 1",
            contentHeight: "weight 1"
        };
    },
    render() {
        return (
            <CenterVertical {...this.props} contentSize={this.props.contentHeight}>
                <CenterHorizontal contentSize={this.props.contentWidth}>
                    {this.props.children}
                </CenterHorizontal>
            </CenterVertical>
        );
    }
});

module.exports = Center;