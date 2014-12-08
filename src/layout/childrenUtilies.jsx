/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

module.exports = {
	toArray: function(children) {
		var childs = children;
		if (!Array.isArray(children)) {
			childs = [children];
		}
		return childs;
	}
};