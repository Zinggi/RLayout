'use strict';

var React = require('react/addons');
var {Layout, resizeMixin, Center, CenterHorizontal, CenterVertical, Spacer} = require('../src/index.jsx');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

var LayoutTestApp = React.createClass({
    mixins: [resizeMixin],
    render() {
        return (
            <Layout orientation="vertical" calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                <Layout orientation="horizontal" size="weight 1">
                    <Layout size="weight 1">
                        I fill the rest of the page
                    </Layout>
                    <Layout size="500px">
                        Yo! I'm exactely 500px!
                    </Layout>
                </Layout>
                <Layout orientation="horizontal" size="weight 3">
                    <Layout size="weight 1">
                        left
                    </Layout>
                    <Layout size="weight 3">
                        <Layout />
                        <Layout size="0.3 ofParent">I'm 30% of my parent!</Layout>
                        <Layout size="50px"/>
                        Look ma! centered!
                    </Layout>
                    <Layout size="weight 1" style={{overflow: "auto"}}>
                        Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC

"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                    </Layout>
                </Layout>
                <Layout size="weight 1">
                    I'm at the bottom!
                </Layout>
            </Layout>
        );
    }
});

var Simple1 = React.createClass({
    mixins: [resizeMixin],
    render() {
        return (
            <Layout orientation="vertical" calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                <Layout size="300px">
                    I'm 300px.
                </Layout>
                <Layout size="weight 1">
                    I'm 1.
                </Layout>
                <Layout size="weight 3">
                    I'm 3.
                </Layout>
                <Layout size="30px">
                    I'm 30px.
                </Layout>
            </Layout>
        );
    }
});

var VeryLongChildTest = React.createClass({
    mixins: [resizeMixin],
    render() {
        return (
            <Layout orientation="vertical" calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                <Layout size="300px">
                    I'm 300px.
                </Layout>
                <Layout>
                    I'm 1.
                </Layout>
                <Layout orientation="horizontal" size="weight 3" style={{overflowX: "auto", overflowY: "hidden"}}>
                    <Layout size="2 ofParent" orientation="horizontal">
                        <Layout>Page 1: I'm 3 high and half a page wide</Layout>
                        <Layout size="weight 2">Page 2: I'm 3 high and a whole page wide</Layout>
                        <Layout>Page 3: I'm 3 high and half a page wide</Layout>
                    </Layout>
                </Layout>
                <Layout size="0.2 ofParent">
                    I'm 0.2 ofParent.
                </Layout>
            </Layout>
        );
    }
});

var ComposedComponents = React.createClass({
    mixins: [resizeMixin],
    render() {
        var textCenter = {
            textAlign: "center"
        };
        return (
            <Layout calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight} style={textCenter}>
                <CenterVertical contentSize="weight 2">
                    This is vertically centered!
                </CenterVertical>
                <CenterHorizontal contentSize="weight 1">
                    <img src="https://www.google.com/images/srpr/logo11w.png"/>
                </CenterHorizontal>
                <Center contentWidth="0.25 ofParent" contentHeight="0.25 ofParent">
                    This is totally centered! check this out!
                </Center>
            </Layout>
        );
    }
});

// React.renderComponent(<LayoutTestApp />, document.getElementById('root'));
// React.renderComponent(<Simple1 />, document.getElementById('root'));
// React.renderComponent(<VeryLongChildTest />, document.getElementById('root'));
React.renderComponent(<ComposedComponents />, document.getElementById('root'));

module.exports = Simple1;
