'use strict';
var ActionTypes = exports.actionsTypes = {
    CHANGE_EXAMPLE: 'CHANGE_EXAMPLE'
};

exports.changeExample = function(store, example) {
    store.dispatch({
        type: ActionTypes.CHANGE_EXAMPLE,
        example: example
    });
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: 'counters'
        };
    }
    switch (action.type) {
        case ActionTypes.CHANGE_EXAMPLE:
            if (action.example === state.example) {
                return state;
            }
            return Object.assign({}, state, {
                example: action.example
            });
        default:
            return state;
    }
};
