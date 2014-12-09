"use strict";

var React = require('react/addons'),
    {Layout, Center, CenterHorizontal, CenterVertical} = require('../src/index');

var Simple = React.createClass({
    render() {
        var style = color => ({
            background: color
        });
        var outline = {
            outline: "1px solid #000"
        };
        return (
            <Layout {...this.props}>
                <CenterVertical contentSize="weight 2" style={style("AliceBlue")}>
                    <Layout style={outline}>This is vertically centered!</Layout>
                </CenterVertical>
                <CenterHorizontal contentSize="weight 1" style={style("Bisque")}>
                    <Layout style={outline}>
                        <img src="https://www.google.com/images/srpr/logo11w.png"/>
                        This image is horizontally centered!
                    </Layout>
                </CenterHorizontal>
                <Center contentWidth="0.25 ofParent" contentHeight="0.25 ofParent" style={style("DarkSeaGreen")}>
                    <Layout style={outline}>This is totally centered! check this out!</Layout>
                </Center>
            </Layout>
        );
    }
});

module.exports = Simple;
