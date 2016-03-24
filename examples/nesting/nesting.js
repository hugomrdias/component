'use strict';
var h = require('hyperscript');
var Component = require('./../../src/component.js');
var Counter = require('./nesting-item.js');
var action = require('./../store.js').action;
var actions = require('./actions-nesting.js');

var List = Component.create({
    init: function() {
        this.componentName = 'list';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().list);
        }.bind(this));

        action({ type: '@@LIST_INIT' })();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        console.log('unsubscribe list');
        // Component.dispatch({
        //     type: '@@LIST_RESET'
        // });
    },

    render: function(compose) {
        return h('div#list', this.props.map(function(counter) {
            return compose(Counter, counter, {
                onIncrement: action(actions.increment, counter.id)
            });
        }));
    }
});

List.actions = {
    increment: function(id) {
        return function() {
            Component.dispatch({
                type: '@@LIST_INCREMENT',
                id: id
            });
        };
    }
};

List.reducer = function(state, action) {
    var initialState = [];

    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case '@@LIST_INIT':
            if (state.length === 0) {
                return [{
                    id: 0,
                    count: 1
                }, {
                    id: 1,
                    count: 9999
                }];
            }
            return state;
        case '@@LIST_RESET':
            return initialState;
        case '@@LIST_INCREMENT':
            state.forEach(function(counter, index) {
                if (counter.id === action.id) {
                    state[index] = {
                        id: action.id,
                        count: counter.count + 1
                    };
                }
            });
            return state;
        default:
            return state;
    }
};

module.exports = List;
