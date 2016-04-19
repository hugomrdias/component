'use strict';
var { Component, h } = require('./../../src/component-simple.js');
var Counter = Component.create({
    render: function(props, handlers) {
        // if (props.counter === 1) {
        //     return h('div', 'loading');
        // }
        return h('div#' + this.cid, [
            h('p', this.props.id + ' ' + this.cid),
            h('button', { on: { click: handlers.onIncrement } }, '+'),
            h('button', { on: { click: handlers.onDecrement } }, '-'),
            h('div', 'Count: ' + this.props.counter)
        ]);
    }
});

module.exports = Counter;
