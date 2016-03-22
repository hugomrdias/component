'use strict';

var Component = require('./component.js');
var Counter = require('./counter.js');
var h = require('hyperscript');
var counterList = Component.create({
    componentDidMount: function() {
        var store = this.props.store;
        this.cid = 'counters';
        this.unsubscribe = store.subscribe(function() {
            console.log('update counters');
            this.update({
                store: store,
                state: store.getState().counters
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    template: function(compose) {
        var dispatch = this.props.store.dispatch;
        var state = this.props.state;
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
        var dispatch = this.props.store.dispatch;
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
            compose(Counter, {
                counter: item,
                onIncrement: inc,
                onDecrement: dec
            }, item.id),
            h('hr')
        ]);
    }
});

counterList.reducer = function countersReducer(state, action) {
    if (typeof state === 'undefined') {
        state = {
            nextId: 1,
            counters: []
        };
    }
    switch (action.type) {
        case 'ADD_COUNTER':
            return Object.assign({}, state, {
                nextId: state.nextId + 1,
                counters: state.counters.concat({
                    counter: 0,
                    id: state.nextId
                })
            });
        case 'RESET_COUNTER':
            return Object.assign({}, state, {
                nextId: 1,
                counters: []
            });
        case 'REMOVE_COUNTER':
            return Object.assign({}, state, {
                counters: state.counters.filter(function(item) {
                    return item.id !== action.id;
                })
            });
        case 'INCREMENT_COUNTER':
            return Object.assign({}, state, {
                counters: state.counters.map(function(item) {
                    if (item.id !== action.id) {
                        return item;
                    }

                    return Object.assign({}, item, {
                        counter: item.counter + 1
                    });
                })
            });
        case 'DECREMENT_COUNTER':
            return Object.assign({}, state, {
                counters: state.counters.map(function(item) {
                    if (item.id !== action.id) {
                        return item;
                    }

                    return Object.assign({}, item, {
                        counter: item.counter - 1
                    });
                })
            });
        default:
            return state;
    }
};

module.exports = counterList;
