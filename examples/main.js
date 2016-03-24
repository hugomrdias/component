'use strict';
var Component = require('./../src/component');
var Store = require('./store.js').store;
var root = document.getElementById('root');
var App;

Component.store = Store;
Component.dispatch = Store.dispatch;

App = require('./app.js');
root.appendChild(new App().mount(Store.getState().examples));
