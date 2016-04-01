'use strict';

// var h = require('hyperscript');
// var Component = require('./../src/component.js');

// var List = require('./nesting/nesting.js');

var { Component, h, helpers } = require('./../src/component-snabb.js');
var { div, span, a, hr } = helpers;
var thunk = require('./store.js').thunk;
var changeExample = require('./reducer-app.js').changeExample;
var App = Component.create({
    init: function() {
        this.componentName = 'app';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().examples);
        }.bind(this));
    },

    render: function(compose) {
        return div('#app', [
            span('Choose:'),
            a({
                on: { click: thunk({ type: 'CHANGE_EXAMPLE', example: 'home' }) }
            }, ' Home'),
            a({
                on: { click: thunk(changeExample, 'counters') }
            }, ' Counters'),
            a({
                onclick: thunk(changeExample, 'list')
            }, ' List'),
            a({
                on: { click: thunk(changeExample, 'form') }
            }, ' Form'),
            hr(''),
            this.chooseExamples(compose)
        ]);
    },

    chooseExamples: function() {
        var state = Component.store.getState();

        switch (this.props.example) {
            case 'counters':
                var Counters = require('./counter-list/counter-list.js');
                return h(Counters, { props: state.counters });
                // case 'list':
                //     return compose(List, state.list);
            case 'home':
                return h('div', 'Home');
            case 'form':
                var Form = require('./form/form.js');
                return h(Form, { props: state.form });
            default:
                return h('div', 'nothing');
        }
    }
});

module.exports = App;
