'use strict';

var { Component, h } = require('./../../src/component-simple.js');
var Counter = Component.create({
    init: function() {
        this.componentName = 'list_item';
    },
    componentDidMount: function() {
        var store = Component.store;
        var id = this.props.id;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().list[id]);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        console.log('unsubscribe counter ', this.props.id);
    },

    render: function({ id, count }, handlers) {
        return h('div', [
            h('p', id + ' ' + this.cid),
            h('button', { on: { click: handlers.onIncrement } }, '+'),
            h('button', { on: { click: handlers.onDecrement } }, '-'),
            h('div', 'Count: ' + count)
        ]);
    }
});

module.exports = Counter;
