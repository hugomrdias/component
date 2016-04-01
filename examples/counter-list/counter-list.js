'use strict';

// var h = require('hyperscript');
// var Component = require('./../../src/component.js');

var { Component, h, reuse } = require('./../../src/component-snabb.js');
var thunk = require('./../store.js').thunk;

var Counter = require('./counter.js');
var actions = require('./actions.js');

var counterList = Component.create({
    init: function() {
        this.componentName = 'counters';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            // console.log('update counters');
            this.update(store.getState().counters);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(compose) {
        return h('div#counters', [
            h('button', { on: { click: thunk(actions.addCounter) } }, 'Add'),
            h('button', { on: { click: thunk(actions.resetCounter) } }, 'Reset'),
            h('hr'),
            h('div.counter-list', this.props.counters.map(function(item) {
                return this.counterItemView(compose, item);
            }.bind(this)))
        ]);
    },

    counterItemView: function(compose, item) {
        return h('div.counter-item', [
            h('button.remove', {
                on: { click: thunk(actions.removeCounter, item.id) }
            }, 'Remove'),
            reuse('counter' + item.id, Counter, item, {
                onIncrement: thunk(actions.incrementCounter, item.id),
                onDecrement: thunk(actions.decrementCounter, item.id)
            }),
            h('hr')
        ]);
    }
});

module.exports = counterList;
