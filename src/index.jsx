'use strict';

var resizeMixin = {
    resize() {
        this.forceUpdate();
    },
    componentDidMount() {
        window.addEventListener('resize', this.resize);
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }
};

module.exports = {
    Layout: require('./layout/Layout'),
    resizeMixin: resizeMixin,
    Center: require('./layout/Center'),
    CenterHorizontal: require('./layout/CenterHorizontal'),
    CenterVertical: require('./layout/CenterVertical'),
    Spacer: require('./layout/Spacer'),
};