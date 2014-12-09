// This test checks if we can use key attributes.
// 
"use strict";

var React = require('react/addons'),
    {Layout} = require('../src/index');

var RefCopyTest = React.createClass({
    clicked() {
        console.log("Should contain two objects: ");
        console.log(this.refs);
    },
    render() {
        return (
            <Layout {...this.props}>
                <div><a ref="test" onClick={this.clicked}>Click me (wraped in div)</a></div>
                <a ref="test2" onClick={this.clicked}>Click me (not wraped)</a>
            </Layout>
        );
    }
});

module.exports = RefCopyTest;
