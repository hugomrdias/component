'use strict';
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var inherits = require('inherits');
var isEqual = require('lodash/isEqualWith');
var isFunction = require(('lodash/isFunction'));
var customizer = function(obj1, obj2) {
    if (isFunction(obj1) && isFunction(obj2)) {
        return true;
    }
};

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

Component.prototype.componentWillMount = function() {
};
Component.prototype.componentDidMount = function() {
};

Component.prototype.componentWillUnmount = function() {
};

Component.prototype.shouldUpdate = function(props) {
    if (isEqual(this.props, props, customizer)) {
        return false;
    }
    return true;
};

Component.prototype.unmount = function() {
    window.cancelAnimationFrame(this.raf);
    this.componentWillUnmount();
    this._clean();
    console.log('Unmount', this.cid);
};

Component.prototype._clean = function() {
    this._components.forEach(function(comp) {
        comp.unmount();
    });
    this._components = [];
};

function compose(component, props, key) {
    var instance;

    if (component instanceof Component) {
        instance = component;
    } else if (component.super_ === Component) {
        instance = new component();
    } else {
        throw new Error('Must be instance of Component or inherit from Component');
    }

    this._components.push(instance);
    return instance.render(props);
}

Component.prototype.update = function(props) {
    var newRoot;

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
            console.log('Skiped render: ', this.cid);
        }
    } else {
        console.error('Why update when not mounted?');
    }
};

Component.prototype.render = function(props, key) {
    window.cancelAnimationFrame(this.raf);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
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
