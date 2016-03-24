'use strict';

exports.reducer = function countersReducer(state, action) {
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
