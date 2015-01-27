'use strict';

var React = require('react/addons');
var {toArray} = require('./childrenUtilies');
require('./objectAssign');

// regexes for parsing the size property
var pxRegex = /((\d*\.)?\d+)px/;
var ofParentRegex = /((\d*\.)?\d+) ofParent/;
var weigthRegex = /weight ((\d*\.)?\d+)/;
var matchChildRegex = /matchChild/;
// create a combined regex, ORing each regex.
var anyOf = (regexes) => {
    var res = "";
    regexes.forEach(r => {
        res += "(" + r.source + ")|";
    });
    return new RegExp("^(" + res.slice(0, -1) + ")$");
};
var validSizeRegex = anyOf([pxRegex, ofParentRegex, weigthRegex, matchChildRegex]);

// tries to get the encoded number with a regex, returns 0 if that fails.
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
                return new Error('"size" needs to be either: "matchChild", "weight 42", "42px" or "0.42 ofParent"');
            }
        }
    },
    getDefaultProps() {
        return {
            orientation: "vertical",
            size: "weight 1"
        };
    },
    getInitialState() {
        return {
            childSizes: []
        };
    },
    componentDidMount() {
        var childIndexes = toArray(this.props.children).map((c, i) => {
            if (c && c.props && matchChildRegex.test(c.props.size)){
                return i;
            }
            return -1;
        }).filter(i => i !== -1);
        if (childIndexes.length > 0) {
            var node = this.getDOMNode();
            var orientation = (this.props.orientation === "vertical") ? "offsetHeight" : "offsetWidth";
            var childSizes = childIndexes.map(i => {
                var test = node.children[i];
                var size = test[orientation];
                if (size === 0) {
                    if (test.children.length > 0) {
                        return test.children[0][orientation];
                    }
                    return 0;
                }
                return size;
            });
            var map = {};
            for(var j = 0; j < childIndexes.length; j += 1) {
                map[childIndexes[j]] = childSizes[j];
            }

            this.setState({ childSizes: map });
        }
    },
    render() {
        // break if the 'break' is set, useful for debugging.
        if (this.props.break) {
            debugger;
        }
        var orientation = this.props.orientation,
            width = this.props.calculatedWidth,
            height = this.props.calculatedHeight,
            left = this.props.calculatedLeft || 0,
            top = this.props.calculatedTop || 0;
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
        var getMatchChildSize = (child, i, s) => {
            if (!matchChildRegex.test(s)) {
                return 0;
            }
            if (this.state && this.state.childSizes){
                return this.state.childSizes[i];
            }
            return 0;
        };

        var oneOf = (fns, string) => {
            for (var i=0; i < fns.length; i++) {
                var res = fns[i](string);
                if (res > 0) {
                    return res;
                }
            }
            return 0;
        };

        var weightIndexes = [], pxIndexes = [];
        var finalSizes = children.map((c, i) => {
            if (React.isValidElement(c)) {
                if (c.props.absolute || c.props.free) {
                    // absolute or free layout elements take up no space
                    return 0;
                }
                var size = c.props.size;
                var px = oneOf([getPixelSize, getOfParentSize, s => getMatchChildSize(c, i, s)], size);
                if (px !== 0) {
                    pxIndexes.push(i);
                    return px;
                } else {
                    weightIndexes.push(i);
                    return getWeigth(size);
                }
            }
            return 0;
        });

        var totalWeight = weightIndexes.reduce((acc, i) => acc + finalSizes[i], 0);
        var totalSizePx = pxIndexes.reduce((acc, i) => acc + finalSizes[i], 0);

        var unitSize = (totalWeight === 0) ? 0 : Math.max((parentSize - totalSizePx) / totalWeight, 0);

        weightIndexes.forEach(i => {
            finalSizes[i] *= unitSize;
        });

        var currentPosition = 0;
        var childComponents = children.map((c, i) => {
            if (React.isValidElement(c)) {
                var size = finalSizes[i];
                var childW = width;//(isVertical) ? width : size;
                var childH = height;//(isVertical) ? size : height;

                var isntFree = !c.props.absolute && !c.props.free;
                var newTop = 0;
                var newLeft = 0;
                if (isntFree) {
                    if (isVertical) {
                        childH = size;
                        newTop = currentPosition;
                    } else {
                        childW = size;
                        newLeft = currentPosition;
                    }
                } if (c.props.free) {
                    childH = window.innerHeight;
                    childW = window.innerWidth;
                }
                var newProps = {
                    calculatedWidth: childW,
                    calculatedHeight: childH,
                    calculatedTop: newTop,
                    calculatedLeft: newLeft,
                    key: c.props.key || i,
                };
                currentPosition += size;
                var debug = c.props.debug || this.props.debug,
                    ref = c.ref;
                if (debug) {
                    newProps.debug = debug;
                } if (ref) {
                    // TODO: Figure out how to preserve ref.
                    // Waiting for this might be the only solution:
                    // https://github.com/facebook/react/issues/1373
                    // In the meanwhile, return the original and hope that nobody passes a ref to a Layout tag...
                    return c;
                }
                return React.addons.cloneWithProps(c, newProps);
            }
            return c;
        });

        var isMatchChild = matchChildRegex.test(this.props.size);
        var layoutStyle = {
            width: (isMatchChild && width === 0) ? undefined : width+"px",
            height: (isMatchChild && height === 0) ? undefined : height+"px",
            top: top+"px",
            left: left+"px",
            position: this.props.free ? "fixed" : "absolute"
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