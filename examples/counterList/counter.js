'use strict';

var Component = require('./component.js');
var h = require('hyperscript');
var Counter = Component.create({
    template: function() {
        return h('div', [
            h('p', this.props.id + ' ' + this.cid),
            h('button', { onclick: this.handlers.onIncrement }, '+'),
            h('button', { onclick: this.handlers.onDecrement }, '-'),
            h('div', 'Count: ' + this.props.counter)
        ]);
    }
});

module.exports = Counter;
