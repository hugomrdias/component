'use strict';

var ActionTypes = exports.actionsTypes = {
    INIT: 'INIT',
    ADD: 'ADD'
};

exports.init = function(store, example) {
    store.dispatch({
        type: ActionTypes.INIT,
        payload: [{
            id: 1,
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            id: 2,
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            id: 3,
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            id: 4,
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
};

exports.addSeries = function(store, example) {
    store.dispatch({
        type: ActionTypes.ADD,
        payload: {
            id: 5,
            name: 'Madrid',
            data: [2.0, 2.9, 2.5, 13, 15, 20, 22, 19, 23.3, 18.3, 13.9, 9.6]
        }
    });
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            series: []
        };
    }
    switch (action.type) {
        case ActionTypes.INIT:
            if (action.payload === state.series) {
                return state;
            }
            return Object.assign({}, state, {
                series: action.payload
            });
        case ActionTypes.ADD:
            if (action.payload === state.series) {
                return state;
            }
            return Object.assign({}, state, {
                series: state.series.concat([action.payload])
            });
        default:
            return state;
    }
};
