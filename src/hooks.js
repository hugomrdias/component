'use strict';
var noop = require('lodash/noop');

exports.root = {
    init: function init(vnode) {
        var instance = vnode.data.instance || vnode.data.type();

        // console.log('INIT thunk', vnode);

        instance.signals.willMount.dispatch();
        instance.componentWillMount();
        instance.root = vnode;

        vnode.children = [instance.prepare.apply(instance, vnode.data.args)];
        vnode.data.instance = instance;
    },

    prepatch: function prepatch(oldVnode, vnode) {
        var instance = oldVnode.data.instance;
        var args = vnode.data.args;

        // console.log('PREPATCH', oldVnode.data.instance.cid, vnode.data.instance.cid);
        // console.log('prepatch vnode', vnode);

        if (oldVnode.data.type === vnode.data.type) {
            console.warn('reuse', oldVnode.data.instance.cid, oldVnode.data);

            vnode.data = oldVnode.data;
            vnode.children = [instance.update.apply(instance, args)];
            instance.root = vnode;
            console.warn('finish reuse');
        } else {
            console.warn('didnt reuse');
        }
    },

    destroy: function destroy(vnode) {
        var instance = vnode.data.instance;

        instance.signals.willUnmount.dispatch();
        instance.componentWillUnmount();
        instance.isMounted = false;
        instance.root = null;
        // instance.vnode = null;
    }
};

exports.vnode = function hooks(context, vnode) {
    var compHooks = vnode.data.hook || {};
    var proxyHooks = {
        insert: compHooks.insert || noop,
        postpatch: compHooks.postpatch || noop
    };

    if (vnode.data.hook) {
        console.warn('Root vnode already has hooks defined, user defined hook will be proxied.');
    }

    compHooks.insert = function(vnode) {
        console.debug('insert ', context.cid);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
            context.root.children[0] = vnode;
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
        }
        proxyHooks.insert.apply(null, arguments);
    };

    compHooks.postpatch = function(old, newNode) {
        // console.debug('postpatch ', context.cid, newNode);
        context.signals.didUpdate.dispatch();
        context.componentDidUpdate();
        context.root.children[0] = newNode;
        proxyHooks.postpatch.apply(null, arguments);
    };

    vnode.data.hook = compHooks;
}
