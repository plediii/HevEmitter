/*jslint node: true */
/* global -Promise */
"use strict";

var _ = require('lodash');

var htree = require('./src/htree');

var addCallback = function (route, tree, cb) {
    htree.addItem(route, tree, cb);
};

var listeners = function (route, tree) {
    return htree.items(route, tree);
};

var emit = function (eventTree, route, args) {
    var ls = listeners(route, eventTree);
    _.each(ls, function (f) {
        f.apply(null, args);
    });
    return ls.length > 0;
};

var EventEmitter = function (options) {
    options = _.defaults({}, options, {
        delimiter: '/'
    });
    this._eventTree = htree.create([]);
    this._newListenerTree = htree.create([]);
    this._removeListenerTree = htree.create([]);
    this._errorTree = htree.create([]);
    this.delimiter = options.delimiter;
};

_.extend(EventEmitter.prototype, {
    parseRoute: function (route) {
        if (_.isString(route))  {
            route = route.split(this.delimiter);
        }
        if (_.any(route, _.isUndefined)) {
            throw new Error('undefined route ' + JSON.stringify(route));
        }
        return route;
    }
    , on: function (route, cb) {
        route = this.parseRoute(route);
        if (route[0] === 'newListener') {
            if (route.length === 1) {
                route = route.concat('**');
            }
            addCallback(route.slice(1), this._newListenerTree, cb);
        }
        else if (route[0] === 'error') {
            if (route.length === 1) {
                route = route.concat('**');
            }
            addCallback(route.slice(1), this._errorTree, cb);
        }
        else if (route[0] === 'removeListener') {
            if (route.length === 1) {
                route = route.concat('**');
            }
            addCallback(route.slice(1), this._removeListenerTree, cb);
        }
        else {
            emit(this._newListenerTree, route, [route, cb]);
            addCallback(route, this._eventTree, cb);
        }
    }
    , emit: function (route) {
        var _this = this;
        route = this.parseRoute(route);
        var args = _.toArray(arguments).slice(1);
        if (route[0] === 'newListener') {
            return false;
        }
        else if (route[0] === 'error') {
            if (!emit(_this._errorTree, route.slice(1), args)) {
                throw args[0];
            }
            return true;
        }
        else {
            return emit(_this._eventTree, route, args);
        }
    } 
    , removeListener: function (route, f) {
        var h = this;
        route = h.parseRoute(route);
        var targetTree;
        var targetRoute;
        if (route[0] === 'error') {
            if (route.length === 1) {
                targetRoute = ['**'];
            } else {
                targetRoute = route.slice(1);
            }
            targetTree = this._errorTree;
        }
        else if (route[0] === 'newListener') {
            if (route.length === 1) {
                targetRoute = ['**'];
            } else {
                targetRoute = route.slice(1);
            }
            targetTree = this._newListenerTree;
        }
        else {
            targetTree = this._eventTree;
            targetRoute = route;
        }
        htree.filterItems(targetRoute, targetTree, f && listenerFilter(f), function (route, f) {
            emit(h._removeListenerTree, route, [route, f]);
        });
    }
    , once: function (route, f) {
        route = this.parseRoute(route);
        var _this = this;
        var g = function () {
            _this.removeListener(route, f);
            return f.apply(null, arguments);
        };
        g.listener = f;
        return this.on(route, g);
    }
    , removeAllListeners: function (route) {
        this.removeListener(route);
    }
    , listeners: function (route) {
        route = this.parseRoute(route);
        return listeners(route, this._eventTree);
    }
});

var listenerFilter = function (f) {
    return function (func) {
        return func === f || func.listener === f;
    };
};

module.exports = {
    EventEmitter: EventEmitter
    , _: _
    , htree: htree
};
