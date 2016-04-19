'use strict';

const h = require('snabbdom/h');

module.exports = function({
    color = '#444',
    width = '24',
    height = '24'
}) {
    return h('svg', {
        attrs: {
            fill: color,
            width: width,
            height: height,
            viewBox: '0 0 24 24'
        }
    }, [
        h('path', {
            attrs: {
                d: 'M0 0h24v24H0z',
                fill: 'none'
            }
        }),
        h('path', {
            attrs: {
                d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'
            }
        })
    ]);
};
