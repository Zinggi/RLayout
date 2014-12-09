'use strict';

var React = require('react/addons');
var CenterHorizontal = require('./CenterHorizontal');
var CenterVertical = require('./CenterVertical');

var Center = React.createClass({
    getDefaultProps() {
        return {
            contentWidth: "weight 1",
            contentHeight: "weight 1",
            verticalSpacer: "weight 1",
            horizontalSpacer: "weight 1",
        };
    },
    render() {
        return (
            <CenterVertical {...this.props} contentSize={this.props.contentHeight} spacerSize={this.props.verticalSpacer}>
                <CenterHorizontal contentSize={this.props.contentWidth} spacerSize={this.props.horizontalSpacer}>
                    {this.props.children}
                </CenterHorizontal>
            </CenterVertical>
        );
    }
});

module.exports = Center;