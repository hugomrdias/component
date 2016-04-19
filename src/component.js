'use strict';
var snabbdom = require('snabbdom');
var patch = snabbdom.init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners')
]);
var Signal = require('mini-signals');
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var inherits = require('inherits');

function Component() {
    if (!(this instanceof Component)) {
        return new Component();
    }
    this.componentName = 'component';
    this.props = {};
    this.vnode = null;
    this.thunk = false;
    this.mountedVnode = null;
    this.isMounted = false;
    this.signals = {
        willMount: new Signal(),
        didMount: new Signal(),
        willUpdate: new Signal(),
        didUpdate: new Signal(),
        willUnmount: new Signal()
    };
    this.init();
    this.cid = uniqueId(this.componentName + '_');
    this.signals.willMount.add(() => console.debug('will mount', this.cid));
    this.signals.didMount.add(() => console.debug('did mount', this.cid));
    this.signals.willUpdate.add(() => console.debug('will update', this.cid));
    this.signals.didUpdate.add(() => console.debug('did update', this.cid));
    this.signals.willUnmount.add(() => console.debug('will unmount', this.cid));
}
Component.create = function(proto) {
    var Child = function() {
        if (!(this instanceof Component)) {
            return new Child();
        }
        Component.apply(this, arguments);
    };

    inherits(Child, Component);
    assign(Child.prototype, proto);
    return Child;
};

Component.prototype.init = noop;

Component.prototype.render = noop;

Component.prototype.componentWillMount = noop;

Component.prototype.componentDidMount = noop;

Component.prototype.componentWillUnmount = noop;

Component.prototype.componentWillUpdate = noop;

Component.prototype.componentDidUpdate = noop;

Component.prototype.shouldComponentUpdate = function(nextProps, handlers, children) {
    if (this.props === nextProps) {
        return false;
    }
    return true;
};

function hooks(context, vnode) {
    var compHooks = vnode.data.hook || {};
    var proxyHooks = {
        create: compHooks.create || noop,
        insert: compHooks.insert || noop,
        destroy: compHooks.destroy || noop,
        prepatch: compHooks.prepatch || noop,
        postpatch: compHooks.postpatch || noop
    };

    if (vnode.data.hook) {
        console.warn('Root vnode already has hooks defined, user defined hook will be proxied.');
    }

    compHooks.create = function(emptyVNode, vnode) {
        // console.log('create', context.cid);
        if (context.thunk) {
            context.mountedVnode.data.vnode = vnode;
            context.mountedVnode.elm = vnode.elm;
        } else {
            context.mountedVnode = vnode;
        }

        if (!context.isMounted) {
            context.signals.willMount.dispatch();
            context.componentWillMount();
        }

        proxyHooks.create.apply(null, arguments);
    };
    compHooks.insert = function(vnode) {
        // console.log('insert ', context.cid);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
        }
        proxyHooks.insert.apply(null, arguments);
    };
    compHooks.destroy = function(vnode) {
        // console.debug('destroy ', context.cid, vnode);
        if (vnode === context.mountedVnode) {
            context.signals.willUnmount.dispatch();
            context.componentWillUnmount();
            context.isMounted = false;
        }
        proxyHooks.destroy.apply(null, arguments);
    };
    compHooks.prepatch = function(old, newNode) {
        // console.debug('prepatch ', context.cid, old, newNode);
        if (old.instance !== newNode.instance) {
            // destroy old
            old.instance.signals.willUnmount.dispatch();
            old.instance.componentWillUnmount();
            old.instance.isMounted = false;
            // mount new
            newNode.instance.signals.willMount.dispatch();
            newNode.instance.componentWillMount();
        }
        proxyHooks.prepatch.apply(null, arguments);
    };

    compHooks.postpatch = function(old, newNode) {
        // console.debug('postpach ', context.cid, newNode);
        if (old.instance === newNode.instance) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
        }
        proxyHooks.postpatch.apply(null, arguments);
    };

    vnode.data.hook = compHooks;
}

Component.prototype.mount = function(props, handlers, children) {
    // console.debug('Mount: ', this.cid, props);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
    this.handlers = handlers;
    this.children = children;
    this.vnode = this.render(props, handlers, children);
    this.vnode.instance = this;
    if (!this.vnode) {
        console.warn('empty render ?!?');
    }
    hooks(this, this.vnode);

    return this.vnode;
};

Component.prototype.update = function(nextProps, handlers, children) {
    var oldRoot = this.vnode;
    var vnode;

    // protect update with empty handlers
    if (!handlers) {
        handlers = this.handlers;
    }

    // protect update with empty children
    if (!children) {
        children = this.children;
    }

    // protect update with empty props
    if (!nextProps) {
        nextProps = this.props;
    }

    if (this.isMounted) {
        if (this.shouldComponentUpdate(nextProps, handlers, children)) {
            this.signals.willUpdate.dispatch(nextProps, handlers, children);
            this.componentWillUpdate(nextProps, handlers, children);
            console.debug('Update: ', this.cid, nextProps);

            // update everything
            this.props = nextProps;
            this.handlers = handlers;
            this.children = children;

            // patch DOM
            vnode = this.render(this.props, this.handlers, this.children);
            vnode.instance = this;
            if (!this.vnode) {
                console.warn('empty render ?!?');
            }
            hooks(this, vnode);
            this.vnode = patch(oldRoot, vnode);
            this.mountedVnode.data.vnode = this.vnode;
        } else {
            console.debug('Skiped: ', this.cid);
        }
    } else {
        console.warn('Why update when not mounted? ', this.cid);
    }
};

module.exports.Component = Component;
module.exports.patch = patch;
