'use strict';
var actionTypes = exports.actionTypes = {
    ADD_COUNTER: 'ADD_COUNTER',
    RESET_COUNTER: 'RESET_COUNTER',
    REMOVE_COUNTER: 'REMOVE_COUNTER',
    INCREMENT_COUNTER: 'INCREMENT_COUNTER',
    DECREMENT_COUNTER: 'DECREMENT_COUNTER'
};

exports.reducer = function countersReducer(state, action) {
    if (typeof state === 'undefined') {
        state = {
            nextId: 1,
            counters: []
        };
    }
    switch (action.type) {
        case actionTypes.ADD_COUNTER:
            return Object.assign({}, state, {
                nextId: state.nextId + 1,
                counters: state.counters.concat({
                    counter: 0,
                    id: state.nextId
                })
            });
        case actionTypes.RESET_COUNTER:
            return Object.assign({}, state, {
                nextId: 1,
                counters: []
            });
        case actionTypes.REMOVE_COUNTER:
            return Object.assign({}, state, {
                counters: state.counters.filter(function(item) {
                    return item.id !== action.id;
                })
            });
        case actionTypes.INCREMENT_COUNTER:
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
        case actionTypes.DECREMENT_COUNTER:
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
