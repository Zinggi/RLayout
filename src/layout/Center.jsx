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
        var {containerProps, orientation, ...otherProps} = this.props;
        return (
            <CenterVertical {...otherProps} contentSize={this.props.contentHeight} spacerSize={this.props.verticalSpacer}>
                <CenterHorizontal contentSize={this.props.contentWidth}
                                  spacerSize={this.props.horizontalSpacer}
                                  orientation={orientation}
                                  containerProps={containerProps}>
                    {this.props.children}
                </CenterHorizontal>
            </CenterVertical>
        );
    }
});

module.exports = Center;