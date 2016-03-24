'use strict';
var CHANGE_EXAMPLE = exports.CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
var bindActionCreators = require('redux').bindActionCreators;

// Actions Creators
exports.creators = {
    changeExample: function(example) {
        return {
            type: CHANGE_EXAMPLE,
            example: example
        };
    }
};

exports.boundCreators = function(dispatch) {
    return bindActionCreators(exports.creators, dispatch);
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: ''
        };
    }
    switch (action.type) {
        case CHANGE_EXAMPLE:
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
