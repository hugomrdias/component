'use strict';

var Component = require('./../src/component.js');
var Counters = {}; //require('./counterList.js');
var List = require('./nesting/list.js');
var h = require('hyperscript');

var creators = require('./reducerApp.js').boundCreators(Component.dispatch);

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
                onclick: () => creators.changeExample('home')
            }, 'Home'),
            h('a', {
                onclick: () => creators.changeExample('counters')
            }, 'Counters'),
            h('a', {
                onclick: () => creators.changeExample('list')
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
