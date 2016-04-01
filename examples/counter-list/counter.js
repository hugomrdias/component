'use strict';

// var Component = require('./../../src/component.js');
// var h = require('hyperscript');

var { Component, h, reuse } = require('./../../src/component-snabb.js');
var Counter = Component.create({
    render: function(props, handlers) {
        return h('div#' + this.cid, [
            h('p', this.props.id + ' ' + this.cid),
            h('button', { on: { click: handlers.onIncrement } }, '+'),
            h('button', { on: { click: handlers.onDecrement } }, '-'),
            h('div', 'Count: ' + this.props.counter)
        ]);
    }
});

module.exports = Counter;
