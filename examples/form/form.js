'use strict';

// var h = require('hyperscript');
// var Component = require('./../../src/component.js');
var { Component, h } = require('./../../src/component-snabb.js');
var store = require('./../store.js');
var find = require('lodash/find');
var thunk = store.thunk;
var validate = require('./form-reducer.js').validate;
var Form = Component.create({
    init: function() {
        this.componentName = 'form';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().form);
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    render: function() {
        var values = this.props.values;

        return h('form', {
            on: {
                change: thunk(validate),
                submit: thunk(validate)
            }
        }, [
            h('label', 'Name: '),
            h('input#name', { props: { type: 'text', value: values.name } }),
            this.renderErrors('name'),
            h('br'),
            h('label', 'Email: '),
            h('input#email', { props: { type: 'email', value: values.email } }),
            this.renderErrors('email'),
            h('br'),
            h('label', 'Age: '),
            h('input#age', { props: { type: 'text', value: values.age } }),
            this.renderErrors('age'),
            h('br'),
            h('input', { props: { type: 'submit' } }, 'Submit')
        ]);
    },
    renderErrors: function(id) {
        var error = find(this.props.errors, function(error) {
            return error.path[0] === id;
        });

        return h('span', error ? error.message : '');
    }
});

module.exports = Form;
