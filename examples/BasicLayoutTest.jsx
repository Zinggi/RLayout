"use strict";

var React = require('react/addons'),
    {Layout} = require('../src/index');

var BasicLayoutTest = React.createClass({
    render() {
        var outline = {
            outline: "1px solid #000"
        };
        return (
            <Layout {...this.props} orientation="vertical">
                <Layout orientation="horizontal" size="weight 1">
                    <Layout size="weight 1" style={outline}>
                        I fill the rest of the page
                    </Layout>
                    <Layout size="500px" style={outline}>
                        Yo! I'm exactely 500px!
                    </Layout>
                </Layout>
                <Layout orientation="horizontal" size="weight 3">
                    <Layout size="weight 1" style={outline}>
                        left
                    </Layout>
                    <Layout size="weight 3" style={outline}>
                        <Layout>I fill the rest!</Layout>
                        <Layout size="0.3 ofParent" style={outline}>I'm 30% of my parent!</Layout>
                        <Layout size="50px">I'm 50px</Layout>
                    </Layout>
                    <Layout size="weight 1" style={{overflow: "auto"}}>
                        Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC

"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                    </Layout>
                </Layout>
                <Layout size="weight 1" style={outline}>
                    I'm at the bottom!
                </Layout>
            </Layout>
        );
    }
});

module.exports = BasicLayoutTest;