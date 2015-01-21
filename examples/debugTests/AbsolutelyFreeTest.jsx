"use strict";

var React = require('react/addons'),
    {Layout, Center, Spacer} = require('../../src/index');

var AbsolutelyFreeTest = React.createClass({
    render() {
        return (
            <Layout {...this.props}>
                <Layout style={{outline: "1px solid #000"}}>
                     Am I still selectable?
                </Layout>
                <Layout orientation="horizontal" style={{outline: "1px solid #000"}}>
                    <Layout style={{outline: "1px solid #000"}} />
                    <Layout style={{outline: "1px solid #000"}}>
                        And what about me?
                    </Layout>
                    <Layout style={{outline: "1px solid #000"}} />
                    {/* absolute */}
                    <Center absolute
                            contentHeight="weight 3"
                            contentWidth="weight 3"
                            orientation="horizontal"
                            style={{outline: "1px solid red"}}
                            containerProps={{style: {outline: "1px solid green"}}}>
                        absolute
                        <Spacer />
                        <Layout size="30px">
                            <Layout size="30px" style={{outline: "1px solid yellow"}} />
                            <Spacer />
                        </Layout>
                    </Center>
                    {/* free */}
                    <Center free
                            contentHeight="weight 5"
                            contentWidth="weight 5"
                            orientation="horizontal"
                            style={{outline: "1px solid orange"}}
                            containerProps={{style: {outline: "1px solid pink"}}}>
                        free
                        <Spacer />
                        <Layout size="30px">
                            <Layout size="30px" style={{outline: "1px solid yellow"}} />
                            <Spacer />
                        </Layout>
                    </Center>
                </Layout>
                <Layout style={{outline: "1px solid #000"}} />
            </Layout>
        );
    }
});

module.exports = AbsolutelyFreeTest;
