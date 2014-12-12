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
                    <div size="200px">
                        This is 200px!
                    </div>
                </Layout>
            </Layout>
        );
    }
});

module.exports = matchChildTest;
