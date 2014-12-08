"use strict";

var React = require('react/addons'),
    Simple = require('./Simple'),
    LongChild = require('./LongChild'),
    BasicLayoutTest = require('./BasicLayoutTest'),
    {Layout, resizeMixin, Spacer} = require('../src/index'),
    mountPoint = document.querySelector('body');

var ShowcaseContainer = React.createClass({
    render() {
        return (
            <Layout calculatedHeight={this.props.calculatedHeight} calculatedWidth={this.props.calculatedWidth}>
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
        return (
            <Layout calculatedHeight={this.props.calculatedHeight} calculatedWidth={this.props.calculatedWidth}>
                <Layout size="100px">
                    <h1>Choose example:</h1>
                </Layout>
                <Layout size="50px">
                    <button onClick={() => this.props.switchView("simple")}>Simple layout</button>
                    Using composed layout elements<br/>
                    <button onClick={() => this.props.switchView("basicTest")}>Basic test layout</button>
                    Only using 'Layout'<br/>
                    <button onClick={() => this.props.switchView("longChild")}>Long child</button>
                    Example with a child thats longer than the parent<br/>
                </Layout>
                <Spacer />
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
        }[this.state.current];

        if (this.state.current === "root") {
            show = <Root switchView={this.switchView}/>;
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