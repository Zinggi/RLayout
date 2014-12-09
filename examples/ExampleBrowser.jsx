"use strict";

var React = require('react/addons'),
    Simple = require('./Simple'),
    LongChild = require('./LongChild'),
    BasicLayoutTest = require('./BasicLayoutTest'),
    RefCopyTest = require('./RefCopyTest'),
    {Layout, resizeMixin, Spacer} = require('../src/index'),
    mountPoint = document.querySelector('body');

var ShowcaseContainer = React.createClass({
    render() {
        return (
            <Layout {...this.props}>
                <Layout size="50px">
                    <button onClick={() => this.props.switchView("root")}>Back</button>
                </Layout>
                <Layout>
                    {this.props.show}
                </Layout>
            </Layout>
        );
    }
});

var Root = React.createClass({
    render() {
        var debugTestViews;
        if (this.props.showDebug) {
            debugTestViews = <Layout>
                <button onClick={() => this.props.switchView("refCopyTest")}>refCopyTest</button><br/>
            </Layout>;
        }
        return (
            <Layout {...this.props}>
                <Layout size="100px">
                    <h1>Choose example:</h1>
                </Layout>
                <Layout>
                    <button onClick={() => this.props.switchView("simple")}>Simple layout</button>
                    Using composed layout elements<br/>
                    <button onClick={() => this.props.switchView("basicTest")}>Basic test layout</button>
                    Only using 'Layout'<br/>
                    <button onClick={() => this.props.switchView("longChild")}>Long child</button>
                    Example with a child thats longer than the parent<br/>
                </Layout>
                {debugTestViews}
            </Layout>
        );
    }
});

var App = React.createClass({
    mixins: [resizeMixin],
    getInitialState() {
        return { current: "root" };
    },
    goBack() {
        this.setState({ current: "root" });
    },
    switchView(view) {
        this.setState({ current: view });
    },
    render() {
        var show = {
            root: Root,
            simple: <Simple />,
            longChild: <LongChild />,
            basicTest: <BasicLayoutTest />,
            refCopyTest: <RefCopyTest />,
        }[this.state.current];

        if (this.state.current === "root") {
            show = <Root switchView={this.switchView} showDebug/>;
        } else {
            show = <ShowcaseContainer switchView={this.switchView} show={show} />;
        }
        return (
            /* The root instance needs a fixes height and width */
            <Layout calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                {show}
            </Layout>
        );
    }
});

React.render(<App />, mountPoint);