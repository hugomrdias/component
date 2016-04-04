'use strict';

var { Component, h, helpers } = require('./../index.js');
var { div, span, a, hr } = helpers;
var thunk = require('./store.js').thunk;
var { changeExample, changeOption } = require('./reducer-app.js');
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
                on: { click: thunk(changeExample, 'list') }
            }, ' List'),
            a({
                on: { click: thunk(changeExample, 'form') }
            }, ' Form'),
            a({
                on: { click: thunk(changeExample, 'children') }
            }, ' Children'),
            hr(''),
            this.chooseExamples(compose)
        ]);
    },

    chooseExamples: function() {
        var state = Component.store.getState();

        switch (this.props.example) {
            case 'home':
                return h('div', 'Home');
            case 'counters':
                var Counters = require('./counter-list/counter-list.js');
                return h(Counters, { props: state.counters });
            case 'list':
                var List = require('./nesting/nesting.js');
                return h(List, { props: state.list });
            case 'form':
                var Form = require('./form/form.js');
                return h(Form, { props: state.form });
            case 'children':
                var Children = require('./children/children.js');
                return h(Children, {
                    key: 'children',
                    props: this.props,
                    on: { onclick: thunk(changeOption) }
                }, [
                    h('li#one', 'one'),
                    h('li#two', 'two'),
                    h('li#three', 'tree')
                ]);
            default:
                return h('div', 'nothing');
        }
    }
});

module.exports = App;
