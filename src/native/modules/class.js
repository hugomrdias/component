'use strict';

module.exports = function updateClass(vnode) {
    var elm = vnode.elm;
    var klass = vnode.data ? vnode.data.class : null;
    var cur;

    for (name in klass) {
        cur = klass[name];
        if (cur) {
            elm.classList.add(name);
        }
    }
};
