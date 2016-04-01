'use strict';
// var h = require('./../src/hyperscript.js');
// var Component = require('./../src/component');
var { Component, mount } = require('./../src/component-snabb.js');
var Store = require('./store.js').store;
var root = document.getElementById('root');
var App;
Component.store = Store;
Component.dispatch = Store.dispatch;

App = require('./app.js');
// root.appendChild(new App().mount(Store.getState().examples));

mount(root, App, Store.getState().examples);
