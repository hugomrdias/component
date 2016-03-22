'use strict';

var Component = require('./component.js');
var h = require('hyperscript');
var Counter = Component.create({
    template: function() {
        return h('div', [
            h('p', this.props.counter.id + ' ' + this.cid),
            h('button', { onclick: this.props.onIncrement }, '+'),
            h('button', { onclick: this.props.onDecrement }, '-'),
            h('div', 'Count: ' + this.props.counter.counter)
        ]);
    }
});

module.exports = Counter;
