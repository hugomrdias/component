'use strict';

var { Component, h, helpers } = require('./../src/component-simple.js');
var { div, span, a, hr } = helpers;
var thunk = require('./store.js').thunk;
var { changeSelect, changeExample, changeOption } = require('./reducer-app.js');
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

    render: function() {
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
            a({
                on: { click: thunk(changeExample, 'chart') }
            }, ' Chart'),
            hr(''),
            this.chooseExamples()
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
            case 'chart':
                var Chart = require('./async-chart/async-chart.js');
                return h(Chart, { key: 'chart', props: state.chart });
            case 'children':
                var Children = require('./children/children.js');
                return h(Children, {
                    key: 'children',
                    props: this.props,
                    on: {
                        onclick: thunk(changeOption),
                        onselect: thunk(changeSelect)
                    }
                });
            default:
                return h('div', 'nothing');
        }
    }
});

module.exports = App;
