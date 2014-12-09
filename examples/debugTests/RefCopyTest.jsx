// This test checks if we can use key attributes.
// 
"use strict";

var React = require('react/addons'),
    {Layout} = require('../../src/index');

var RefCopyTest = React.createClass({
    clicked(e) {
        console.log("Should contain three objects: ");
        console.log(this.refs);
        console.log("e.target: ");
        console.log(e.target);
        console.log("should be the same as doing this.refs[ref].getDOMNode()");
    },
    render() {
        return (
            <Layout {...this.props}>
                <div><a ref="test" onClick={this.clicked}>Click me (wraped in div)</a></div>
                <a ref="test2" onClick={this.clicked}>Click me (not wraped)</a>
                <Layout ref="test3" onClick={this.clicked}>Click me (I'm a layout and causing trouble)</Layout>
            </Layout>
        );
    }
});

module.exports = RefCopyTest;
