'use strict';

var h = require('hyperscript');
var Component = require('./../src/component.js');
var Counters = require('./counter-list/counter-list.js');
var List = require('./nesting/nesting.js');
var action = require('./store.js').action;
var actions = require('./actions.js');
var App = Component.create({
    componentDidMount: function() {
        var store = Component.store;

        this.cid = 'app';
        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().examples);
        }.bind(this));
    },

    render: function(compose) {
        return h('div', [
            h('span', 'Choose:'),
            h('a', {
                onclick: action({ type: 'CHANGE_EXAMPLE', example: 'home' })
            }, 'Home'),
            h('a', {
                onclick: action(actions.changeExample, 'counters')
            }, 'Counters'),
            h('a', {
                onclick: action(actions.changeExample, 'list')
            }, 'List'),
            h('hr'),
            this.chooseExamples(compose)
        ]);
    },

    chooseExamples: function(compose) {
        var state = Component.store.getState();

        switch (this.props.example) {
            case 'counters':
                return compose(Counters, state.counters);
            case 'list':
                return compose(List, state.list);
            case 'home':
                return h('div', 'Home');
            default:
                return h('div', 'nothing');
        }
    }
});

module.exports = App;
