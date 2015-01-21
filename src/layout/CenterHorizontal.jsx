'use strict';

var React = require('react/addons');
var Layout = require('./Layout');
var Spacer = require('./Spacer');

var CenterHorizontal = React.createClass({
    getDefaultProps() {
        return {
            contentSize: "weight 1",
            spacerSize: "weight 1",
        };
    },
    render() {
        var {containerProps, orientation, ...otherProps} = this.props;
        return (
            <Layout {...otherProps} orientation="horizontal">
                <Spacer size={this.props.spacerSize}/>
                <Layout {...containerProps} orientation={orientation} size={this.props.contentSize}>
                    {this.props.children}
                </Layout>
                <Spacer size={this.props.spacerSize}/>
            </Layout>
        );
    }
});

module.exports = CenterHorizontal;