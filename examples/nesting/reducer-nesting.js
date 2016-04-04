'use strict';
var actionTypes = exports.actionTypes = {
    INIT: '@@LIST_INIT',
    RESET: '@@LIST_RESET',
    INCREMENT: '@@LIST_INCREMENT'
};

exports.increment = function(store, id) {
    store.dispatch({
        type: actionTypes.INCREMENT,
        id: id
    });
};

exports.reducer = function(state, action) {
    var initialState = [];

    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case actionTypes.INIT:
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
        case actionTypes.RESET:
            return initialState;
        case actionTypes.INCREMENT:
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
