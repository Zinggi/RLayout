'use strict';

var React = require('react/addons');
var {toArray} = require('./childrenUtilies');
require('./objectAssign');


var pxRegex = /((\d*\.)?\d+)px/;
var ofParentRegex = /((\d*\.)?\d+) ofParent/;
var weigthRegex = /weight ((\d*\.)?\d+)/;
var anyOf = (regexes) => {
	var res = "";
	regexes.forEach(r => {
		res += "(" + r.source + ")|";
	});
	return new RegExp("^(" + res.slice(0, -1) + ")$");
};
var validSizeRegex = anyOf([pxRegex, ofParentRegex, weigthRegex, /matchChildren/]);


var parseNum = (string, regex) => {
	var res = regex.exec(string);
	return (res) ? parseFloat(res[1]) : 0;
};

var Layout = React.createClass({
	propTypes: {
		orientation(props, propName, componentName) {
			if (!/^((vertical)|(horizontal))$/.test(props[propName])) {
				return new Error('Orientation needs to be either "vertical" or "horizontal"');
			}
	    },
		size(props, propName, componentName) {
			if ( !validSizeRegex.test(props[propName]) ) {
		        return new Error('"size" needs to be either: "matchChildren", "weight 42", "42px" or "0.42 ofParent"');
		    }
		}
	},

	getDefaultProps() {
		return {
			orientation: "vertical",
			size: "weight 1"
		};
	},
	// TODO:
	// Implement match children:
	// Render the child layout element with attribute matchChildren alone, using:
	// 		React.renderComponent(<div style={{width: "xxx"}}>theChild</div>, somePlaceFarOutside);
	// Find its size -> using either:
	// 		.clientHeight, .offsetHeight or .scrollHeight
	// Remove element again.
	render() {
		// break if the 'break' is set, useful for debugging.
		if (this.props.break) {
			debugger;
		}
		var orientation = this.props.orientation,
			width = this.props.calculatedWidth,
			height = this.props.calculatedHeight,
			left = this.props.left || 0,
			top = this.props.top || 0;
		var isVertical = orientation === "vertical";

		var parentSize = (isVertical) ? height : width;


		var children = toArray(this.props.children);
		
		var getPixelSize = (size) => {
			return parseNum(size, pxRegex);
		};
		var getOfParentSize = (size) => {
			return parseNum(size, ofParentRegex) * parentSize;
		};
		var getWeigth = (size) => {
			return parseNum(size || "weight 1", weigthRegex);
		};

		var totalSizePx = 0,
			totalWeigth = 0;
		children.forEach((c) => {
			if (React.isValidElement(c)) {
				var size = c.props.size;
				totalSizePx += getPixelSize(size);
				totalSizePx += getOfParentSize(size);
				totalWeigth += getWeigth(size);
			}
		});

		var unitSize = (totalWeigth === 0) ? 0 : Math.max((parentSize - totalSizePx) / totalWeigth, 0);

		var oneOf = (fns, string) => {
			for (var i=0; i < fns.length; i++) {
				var res = fns[i](string);
				if (res > 0) {
					return res;
				}
			}
			return 0;
		};
		var finalSizes = children.map(c => {
			if (React.isValidElement(c)) {
				var size = c.props.size;
				return oneOf([getPixelSize, getOfParentSize, s => getWeigth(s)*unitSize], size);
			}
			return 0;
		});

		var currentPosition = 0;
		var childComponents = children.map((c, i) => {
			var size = finalSizes[i];
			var childW = (isVertical) ? width : size;
			var childH = (isVertical) ? size : height;
			if (React.isValidElement(c)) {
				var ret = React.addons.cloneWithProps(c, {
					calculatedWidth: childW,
					calculatedHeight: childH,
					top: (isVertical) ? currentPosition : 0,
					left: (isVertical) ? 0 : currentPosition,
					debug: this.props.debug,
					key: i
				});
				currentPosition += size;
				return ret;
			}
			return c;
		});

		var layoutStyle = {
			width: width+"px",
			height: height+"px",
			top: top+"px",
			left: left+"px",
			position: "absolute"
		};

		if (this.props.debug) {
			var randByte = () => Math.floor(Math.random()*256);
			var debugColor = "rgba("+randByte()+","+randByte()+","+randByte()+",0.2)";
			layoutStyle.background = debugColor;
		}
		var combinedStyle = Object.assign(layoutStyle, this.props.style);

		if (this.props.dontRender) {
			return null;
		}
		return (
			<div {...this.props} style={combinedStyle}>
				{childComponents}
			</div>
		);
	}

});

module.exports = Layout;