'use strict';

module.exports = function updateEventListeners(vnode) {
    var elm = vnode.elm;
    var on = vnode.data ? vnode.data.on : null;
    var cur;

    if (!on) {
        return;
    }

    for (name in on) {
        cur = on[name];
        if (Array.isArray(cur)) {
            elm.addEventListener.apply(elm, [name].concat(cur));
        } else {
            elm.addEventListener(name, cur, false);
        }
    }
};
