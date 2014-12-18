"use strict";

var React = require('react/addons'),
	{Perf, PureRenderMixin} = React.addons,
    {Layout, Center} = require('../../src/index');

var PerformanceTest = React.createClass({
	getInitialState() {
		return {
			rotation: 0
		};
	},
	rotate() {
		var newRot = (this.state.rotation > 360) ? this.state.rotation - 360 : this.state.rotation;
		var anim = window.requestAnimationFrame(this.rotate);
		this.setState({
			rotation: newRot + 1,
			anim: anim
		});
	},
	componentDidMount() {
		Perf.start();
		window.requestAnimationFrame(this.rotate);
	},
	componentWillUnmount() {
		window.cancelAnimationFrame(this.state.anim);
		Perf.stop();
		console.log("Inclusive Times");
		Perf.printInclusive();
		console.log("Exclusive Times");
		Perf.printExclusive();
		console.log("Wasted");
		Perf.printWasted();
		console.log("Dom");
		Perf.printDOM();
	},
    render() {
    	var rotatingStyle = {
    		outline: "1px solid #000",
    		WebkitTransform: "rotateY(" + this.state.rotation + "deg)"
    	};
        return (
            <Center {...this.props} horizontalSpacer="0.1 ofParent" verticalSpacer="50px">
                <Layout style={{outline: "1px solid #000"}} size="matchChild">
                	I'm not changing and always as big as my containing test!
                </Layout>
                <Layout style={{outline: "1px solid #000"}}>
                	<Layout style={{outline: "1px solid #000"}}>
                		I'm rotating!
                	</Layout>
                	<Layout style={rotatingStyle}>
                		I'm rotating!
                	</Layout>
                	<Layout style={{outline: "1px solid #000"}}>
                		I'm rotating!
                	</Layout>
                </Layout>
                <Layout style={{outline: "1px solid #000"}} size="0.2 ofParent">
					I'm not changing and always 0.2 of my parent!
                </Layout>
            </Center>
        );
    }
});

module.exports = PerformanceTest;
