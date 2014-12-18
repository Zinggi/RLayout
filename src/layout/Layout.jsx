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

// measure the size of an element.
var measureDomElement = (child, isVertical, parentSize) => {
    // create a container
    var container = document.createElement("div");
    container.style.visibility = "hidden";
    container.style.position = "absolute";
    document.body.appendChild(container);

    var testWidth = (isVertical) ? parentSize : undefined;
    var testHeight = (isVertical) ? undefined : parentSize;
    // render a div with the given dimension defined
    var rendered = React.render(<Layout calculatedHeight={testHeight} calculatedWidth={testWidth}>{child}</Layout>, container);
    var domNodeChild = rendered.getDOMNode();

    // get the size of the rendered element
    var measuredDimention = (isVertical) ? "offsetHeight" : "offsetWidth";
    var size = domNodeChild[measuredDimention];

    // remove it again
    container.parentNode.removeChild(container);
    return size;
};

// finds the size of an element.
var getChildSize = (child, isVertical, parentSize) => {
    if (React.isValidElement(child)) {
        var size = child.props.size;
        if (size !== undefined) {
            // try to see if we have a defined size.
            var sizePx = parseNum(size, pxRegex);
            if (sizePx !== 0) {
                return sizePx;
            }
        }
    }
    if (child instanceof Array) {
        console.error("couldn't determine child size! You can only have one child when using 'matchChild'!");
    }
    return 0;
    // if it either isn't a react element or if we couldn't find the size, measure it.
    // return measureDomElement(child, isVertical, parentSize);
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
            var orientation = (this.props.orientation === "vertical") ? "clientHeight" : "clientWidth";
            var childSizes = childIndexes.map(i => {
                var test = node.children[i];
                if (test[orientation] === 0) {
                    return test.children[0][orientation];
                }
                return test[orientation];
            });
            var map = {};
            for(var i = 0; i < childIndexes.length; i += 1) {
                map[childIndexes[i]] = childSizes[i];
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
                // return child.state.childSize;
                return this.state.childSizes[i];
            }
            return 0;/*getChildSize(child.props.children, isVertical, (isVertical) ? width : height);*/
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
            var size = finalSizes[i];
            var childW = (isVertical) ? width : size;
            var childH = (isVertical) ? size : height;
            if (React.isValidElement(c)) {
                var newProps = {
                    calculatedWidth: childW,
                    calculatedHeight: childH,
                    calculatedTop: (isVertical) ? currentPosition : 0,
                    calculatedLeft: (isVertical) ? 0 : currentPosition,
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