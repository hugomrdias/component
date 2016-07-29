'use strict';

var { Component, h } = require('./../../src/component-simple.js');
var { thunk } = require('./../store.js');
var Counter = require('./counter.js');
var actions = require('./actions.js');

var counterList = Component.create({
    init: function() {
        this.componentName = 'counters';
    },

    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().counters);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function() {
        return h('div#counters', [
            h('button', { on: { click: thunk(actions.addCounter) } }, 'Add'),
            h('button', { on: { click: thunk(actions.resetCounter) } }, 'Reset'),
            h('hr'),
            h('div.counter-list', this.props.counters.map(function(item) {
                return this.counterItemView(item);
            }.bind(this)))
        ]);
    },

    counterItemView: function(item) {
        return h('div.counter-item', [
            h('button.remove', {
                on: { click: thunk(actions.removeCounter, item.id) }
            }, 'Remove'),
            h(Counter, {
                key: 'counter-item-' + item.id,
                props: item,
                on: {
                    onIncrement: thunk(actions.incrementCounter, item.id),
                    onDecrement: thunk(actions.decrementCounter, item.id)
                }
            }),
            h('hr')
        ]);
    }
});

module.exports = counterList;
