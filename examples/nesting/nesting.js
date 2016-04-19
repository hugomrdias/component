'use strict';
var { Component, h } = require('./../../src/component-simple.js');
var { thunk } = require('./../store.js');
var { increment } = require('./reducer-nesting.js');
var Counter = require('./nesting-item.js');

var List = Component.create({
    init: function() {
        this.componentName = 'list';
    },
    componentDidMount: function() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().list);
        }.bind(this));

        thunk({ type: '@@LIST_INIT' })();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        console.log('unsubscribe list');
        // Component.dispatch({
        //     type: '@@LIST_RESET'
        // });
    },

    render: function() {
        return h('div#list', this.props.map(function(counter) {
            return h(Counter, {
                // key: 'ddddd',
                props: counter,
                on: {
                    onIncrement: thunk(increment, counter.id)
                }
            });
        }));
    }
});

module.exports = List;
