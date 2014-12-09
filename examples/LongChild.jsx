"use strict";

var React = require('react/addons'),
    {Layout} = require('../src/index');

var LongChild = React.createClass({
    render() {
        var outline = {
            outline: "1px solid #000"
        };
        return (
            <Layout {...this.props} orientation="vertical">
                <Layout size="300px" style={outline}>
                    I'm 300px.
                </Layout>
                <Layout style={outline}>
                    I'm 1.
                </Layout>
                <Layout orientation="horizontal" size="weight 3" style={{overflowX: "auto", overflowY: "hidden"}}>
                    <Layout size="2 ofParent" orientation="horizontal">
                        <Layout style={outline}>Page 1: I'm 3 high and half a page wide</Layout>
                        <Layout size="weight 2" style={outline}>Page 2: I'm 3 high and a whole page wide</Layout>
                        <Layout style={outline}>Page 3: I'm 3 high and half a page wide</Layout>
                    </Layout>
                </Layout>
                <Layout size="0.2 ofParent" style={outline}>
                    I'm 0.2 ofParent.
                </Layout>
            </Layout>
        );
    }
});

module.exports = LongChild;