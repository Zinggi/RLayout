"use strict";

var React = require('react/addons'),
    {Layout, Center} = require('../../src/index');

var test = React.createClass({
    render() {
        var innerStyle = {
            style: {outline: "1px solid red"}
        };
        var outerStyle = {
            outline: "1px solid green"
        };
        return (
            <Center {...this.props} style={outerStyle} horizontalSpacer="0.1 ofParent" verticalSpacer="50px" containerProps={innerStyle}>
                My container received those props: {JSON.stringify(innerStyle)}
            </Center>
        );
    }
});

module.exports = test;
