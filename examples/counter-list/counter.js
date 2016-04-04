'use strict';
var { Component, h } = require('./../../index.js');
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
