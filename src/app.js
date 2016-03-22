'use strict';

var Component = require('./component.js');
var Counters = require('./counterList.js');
var h = require('hyperscript');
var App = Component.create({
    componentDidMount: function() {
        var store = this.props.store;
        this.cid = 'app';

        this.unsubscribe = store.subscribe(function() {
            console.log('update', this.cid);
            this.update({
                store: store,
                state: store.getState().examples
            });
        }.bind(this));
    },
    template: function(compose) {
        var state = this.props.state;
        var store = this.props.store;
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
            h('hr'),
            this.chooseExamples(compose, store, state)
        ]);
    },

    chooseExamples: function(compose, store, state) {
        switch (state.example) {
            case 'counters':
                return compose(Counters, {
                    store: store,
                    state: store.getState().counters
                });
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
            return Object.assign({}, state, {
                example: action.example
            });
        default:
            return state;
    }
};

module.exports = App;
