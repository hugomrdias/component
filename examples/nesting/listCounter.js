'use strict';

var Component = require('./../../src/component.js');
var h = require('hyperscript');
var Counter = Component.create({
    init: function() {
        this.componentName = 'counter';
    },
    componentDidMount: function() {
        var store = Component.store;
        var id = this.props.id;

        this.cid = id;
        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().list[id]);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        console.log('unsubscribe counter ', this.props.id);
    },

    render: function() {
        return h('div', [
            h('p', this.props.id + ' ' + this.cid),
            h('button', { onclick: this.handlers.onIncrement }, '+'),
            h('button', { onclick: this.handlers.onDecrement }, '-'),
            h('div', 'Count: ' + this.props.count)
        ]);
    }
});

module.exports = Counter;
