'use strict';

var Component = require('./component.js');
var Counter = require('./counter.js');
var h = require('hyperscript');

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

    template: function(compose) {
        var dispatch = Component.dispatch;
        var state = this.props;
        var add = function() {
            dispatch({
                type: 'ADD_COUNTER'
            });
        };
        var reset = function() {
            dispatch({
                type: 'RESET_COUNTER'
            });
        };

        return h('div', [
            h('button', { onclick: add }, 'Add'),
            h('button', { onclick: reset }, 'Reset'),
            h('hr'),
            h('div.counter-list', state.counters.map(function(item) {
                return this.counterItemView(item, compose);
            }.bind(this)))
        ]);
    },

    counterItemView: function(item, compose) {
        var dispatch = Component.dispatch;
        var remove = function() {
            dispatch({
                type: 'REMOVE_COUNTER',
                id: item.id
            });
        };
        var inc = function() {
            dispatch({
                type: 'INCREMENT_COUNTER',
                id: item.id
            });
        };
        var dec = function() {
            dispatch({
                type: 'DECREMENT_COUNTER',
                id: item.id
            });
        };

        return h('div.counter-item', { 'data-id': item.id }, [
            h('button.remove', { onclick: remove }, 'Remove'),
            compose(Counter, item, {
                onIncrement: inc,
                onDecrement: dec
            }),
            h('hr')
        ]);
    }
});

module.exports = counterList;
