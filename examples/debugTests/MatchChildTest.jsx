"use strict";

var React = require('react/addons'),
    {Layout} = require('../../src/index');

var matchChildTest = React.createClass({
    render() {
        return (
            <Layout {...this.props}>
                <Layout size="matchChild">
                    <div>
                        <h1> Hallo! </h1>
                        Some text!<br />
                        What about an image?
                        <img src="https://www.google.com/images/srpr/logo11w.png" />
                    </div>
                </Layout>
                <Layout size="matchChild">
                    <Im200 />
                </Layout>
                <Layout>
                    Fill the rest
                </Layout>
            </Layout>
        );
    }
});

var Im200 = React.createClass({
    getDefaultProps() {
        return { size: "200px" };
    },
    render() {
        return (
            <Layout {...this.props}>
                This is 200px!
            </Layout>
        );
    }
});

module.exports = matchChildTest;
