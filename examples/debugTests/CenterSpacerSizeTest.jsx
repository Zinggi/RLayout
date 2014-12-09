"use strict";

var React = require('react/addons'),
    {Layout, Center} = require('../../src/index');

var CenterSpacerSizeTest = React.createClass({
    render() {
        return (
            <Center {...this.props} horizontalSpacer="0.1 ofParent" verticalSpacer="50px">
                <Layout style={{outline: "1px solid #000"}}>
                    Left and rigth of me are 0.1 ofParent,
                    Top and bottom are 50px.
                </Layout>
            </Center>
        );
    }
});

module.exports = CenterSpacerSizeTest;
