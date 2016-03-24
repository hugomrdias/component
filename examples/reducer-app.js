'use strict';
var ActionTypes = exports.actionsTypes = {
    CHANGE_EXAMPLE: 'CHANGE_EXAMPLE'
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: ''
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
