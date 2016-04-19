'use strict';
var ActionTypes = exports.actionsTypes = {
    CHANGE_EXAMPLE: 'CHANGE_EXAMPLE',
    CHANGE_OPTION: 'CHANGE_OPTION',
    CHANGE_SELECT: 'CHANGE_SELECT'
};

exports.changeExample = function(store, example) {
    store.dispatch({
        type: ActionTypes.CHANGE_EXAMPLE,
        example: example
    });
};

exports.changeOption = function(store, selected) {
    store.dispatch({
        type: ActionTypes.CHANGE_OPTION,
        selected: selected
    });
};

exports.changeSelect = function(store, selected) {
    store.dispatch({
        type: ActionTypes.CHANGE_SELECT,
        selected: selected
    });
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: 'chart',
            selected: '',
            select: 1
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

        case ActionTypes.CHANGE_OPTION:
            if (action.selected === state.selected) {
                return state;
            }
            return Object.assign({}, state, {
                selected: action.selected
            });
        case ActionTypes.CHANGE_SELECT:
            if (action.selected === state.selected) {
                return state;
            }
            return Object.assign({}, state, {
                select: action.selected
            });
        default:
            return state;
    }
};
