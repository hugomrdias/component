'use strict';

var h = require('hyperscript');
var Component = require('./../../src/component.js');
var Counter = require('./counter.js');
var action = require('./../store.js').action;
var actions = require('./actions.js');

var counterList = Component.create({
    componentDidMount: function() {
        var store = Component.store;

        this.cid = 'counters';
        this.unsubscribe = store.subscribe(function() {
            console.log('update counters');
            this.update(store.getState().counters);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(compose) {
        return h('div', [
            h('button', { onclick: action(actions.addCounter) }, 'Add'),
            h('button', { onclick: action(actions.resetCounter) }, 'Reset'),
            h('hr'),
            h('div.counter-list', this.props.counters.map(function(item) {
                return this.counterItemView(compose, item);
            }.bind(this)))
        ]);
    },

    counterItemView: function(compose, item) {
        return h('div.counter-item', { 'data-id': item.id }, [
            h('button.remove', {
                onclick: action(actions.removeCounter, item.id)
            }, 'Remove'),
            compose(Counter, item, {
                onIncrement: action(actions.incrementCounter, item.id),
                onDecrement: action(actions.decrementCounter, item.id)
            }),
            h('hr')
        ]);
    }
});

module.exports = counterList;
