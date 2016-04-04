'use strict';

const h = require('snabbdom/h');
var { button } = require('hyperscript-helpers')(h);

module.exports = function({
    flat = false,
    onClick,
    type = 'button'
}, children = '') {
    const enabled = onClick || type === 'submit';

    return button('.Button', {
        hook: {
            create: function(empty, e) {
                // console.log(e);
            },
            update: function(e) {
                // console.log('update button', e)
            }
        },
        on: {
            click: (e) => onClick ? onClick(e) : null
        },
        class: {
            'Button--flat': flat
        },
        props: {
            type,
            disabled: !enabled
        }
    }, children);
};
