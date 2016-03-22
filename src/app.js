'use strict';

var Component = require('./component.js');
var Counters = require('./counterList.js');
var List = require('./nesting/list.js');
var h = require('hyperscript');
var App = Component.create({
    componentDidMount: function() {
        var store = Component.store;

        this.cid = 'app';

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().examples);
        }.bind(this));
    },
    template: function(compose) {
        var state = this.props;
        var store = Component.store;
        var dispatch = store.dispatch;

        return h('div', [
            h('span', 'Choose:'),
            h('a', {
                onclick: function() {
                    dispatch({
                        type: 'CHANGE_EXAMPLE',
                        example: 'home'
                    });
                }
            }, 'Home'),
            h('a', {
                onclick: function() {
                    dispatch({
                        type: 'CHANGE_EXAMPLE',
                        example: 'counters'
                    });
                }
            }, 'Counters'),
            h('a', {
                onclick: function() {
                    dispatch({
                        type: 'CHANGE_EXAMPLE',
                        example: 'list'
                    });
                }
            }, 'List'),
            h('hr'),
            this.chooseExamples(compose, store, state)
        ]);
    },

    chooseExamples: function(compose, store, state) {
        switch (state.example) {
            case 'counters':
                return compose(Counters, store.getState().counters);
            case 'list':
                return compose(List, store.getState().list);
            case 'home':
                return h('div', 'Home');
            default:
                return h('div', 'nothing');
        }
    }
});

App.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: ''
        };
    }
    switch (action.type) {
        case 'CHANGE_EXAMPLE':
            // if (action.example === state.example) {
            //     return state;
            // }
            return Object.assign({}, state, {
                example: action.example
            });
        default:
            return state;
    }
};

module.exports = App;
