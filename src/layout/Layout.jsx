/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var {toArray} = require('./childrenUtilies');

// object.assign polyfill from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
	Object.defineProperty(Object, "assign", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target, firstSource) {
			if (target === undefined || target === null) {
				throw new TypeError("Cannot convert first argument to object");
			}
			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) { continue; }
				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) { to[nextKey] = nextSource[nextKey]; }
				}
			}
			return to;
		}
	});
}


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
			if (React.isValidComponent(c)) {
				var size = c.props.size;
				totalSizePx += getPixelSize(size);
				totalSizePx += getOfParentSize(size);
				totalWeigth += getWeigth(size);
			}
		});

		var unitSize = (totalWeigth === 0) ? 0 : Math.max((parentSize - totalSizePx) / totalWeigth, 0);

		// console.log("px: "+totalSizePx+" weigth: "+totalWeigth+" unitSize: "+unitSize);

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
			if (React.isValidComponent(c)) {
				var size = c.props.size;
				return oneOf([getPixelSize, getOfParentSize, s => getWeigth(s)*unitSize], size);
			}
			return 0;
		});

		// console.log("finalSizes: "+finalSizes);

		var randByte = () => Math.floor(Math.random()*256);
		var debugColor = "rgba("+randByte()+","+randByte()+","+randByte()+",0.2)";

		var layout = {
			width: width+"px",
			height: height+"px",
			top: top+"px",
			left: left+"px",
			background: debugColor,
			position: "absolute"
		};

		var currentPosition = 0;
		var childComponents = children.map((c, i) => {
			var size = finalSizes[i];
			var childW = (isVertical) ? width : size;
			var childH = (isVertical) ? size : height;
			if (React.isValidComponent(c)) {
				var ret = React.addons.cloneWithProps(c, {
					calculatedWidth: childW,
					calculatedHeight: childH,
					top: (isVertical) ? currentPosition : 0,
					left: (isVertical) ? 0 : currentPosition,
					key: i
				});
				currentPosition += size;
				return ret;
			}
			return c;
		});
		var combinedStyle = Object.assign(layout, this.props.style);

		if (this.props.dontRender) {
			// if this layout has no children, we don't need to render anything, it's just a spacer
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