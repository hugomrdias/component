'use strict';
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var inherits = require('inherits');

function Component() {
    this.componentName = 'component';
    this.props = {};
    this.root = null;
    this.container = null;
    this.isMounted = false;
    this.raf = null;
    this._components = [];
    this.init();
    this.cid = uniqueId(this.componentName + '_');
}

Component.create = function(proto) {
    var child = function() {
        Component.apply(this, arguments);
    };

    inherits(child, Component);
    assign(child.prototype, proto);
    return child;
};

Component.prototype.init = noop;

Component.prototype.template = noop;

Component.prototype.afterRender = noop;

Component.prototype.componentWillMount = function() {};

Component.prototype.componentDidMount = function() {};

Component.prototype.componentWillUnmount = function() {};

Component.prototype.shouldUpdate = function(props) {
    if (this.props === props) {
        return false;
    }
    return true;
};

Component.prototype.unmount = function() {
    window.cancelAnimationFrame(this.raf);
    this._clean();
    this.componentWillUnmount();
    this.isMounted = false;
    console.log('Unmount', this.cid);
};

Component.prototype._clean = function() {
    this._components.forEach(function(comp) {
        comp.unmount();
    });
    this._components = [];
};

function compose(component, props, handlers) {
    var instance;

    if (component instanceof Component) {
        instance = component;
    } else if (component.super_ === Component) {
        instance = new component();
    } else {
        throw new Error('Must be instance of Component or inherit from Component');
    }

    this._components.push(instance);
    return instance.render(props, handlers);
}

Component.prototype.update = function(props, handlers) {
    var newRoot;

    console.debug('Update: ', this.cid, this.props);
    if (typeof handlers !== 'undefined') {
        this.handlers = handlers;
    }

    if (this.isMounted) {
        if (this.shouldUpdate(props)) {
            this.props = props;
            this.container = this.root.parentNode;
            this._clean();
            newRoot = this.template(compose.bind(this));
            this.container.replaceChild(newRoot, this.root);
            this.root = newRoot;
            // console.log('Updated: ', this.cid, this.props);
        } else {
            console.log('Skiped: ', this.cid);
        }
    } else {
        console.error('Why update when not mounted? ', this.cid);
    }
};

Component.prototype.render = function(props, handlers) {
    window.cancelAnimationFrame(this.raf);

    console.debug('Render: ', this.cid, this.props);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
    this.handlers = handlers;
    this.componentWillMount();
    this.root = this.template(compose.bind(this));
    // pass

    this.raf = window.requestAnimationFrame(function() {
        this.isMounted = true;
        this.componentDidMount();
    }.bind(this));
    return this.root;
};

module.exports = Component;
