'use strict';
var h = require('hyperscript');
var Component = require('./../component.js');
var Counter = require('./listCounter.js');
var List = Component.create({
    init: function() {
        this.componentName = 'list';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().list);
        }.bind(this));

        Component.dispatch({
            type: '@@LIST_INIT'
        });
        // this.unsubscribe();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        console.log('unsubscribe list')
        // Component.dispatch({
        //     type: '@@LIST_RESET'
        // });
    },

    template: function(compose) {
        var state = this.props;

        return h('div#list', state.map(function(counter) {
            console.log(counter)
            return compose(Counter, counter, {
                onIncrement: List.actions.increment(counter.id)
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
            return [{
                id: 0,
                count: 1
            }, {
                id: 1,
                count: 9999
            }];
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
