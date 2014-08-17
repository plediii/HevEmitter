/*jslint node: true */
"use strict";

var _ = require('underscore');
var Promise = require('bluebird');

var eventTree = function () {
    return {
        hash: {}
        , funcs: []
        , promises: []
    };
};

var addCallback = function (route, tree, cb) {
    var head = _.head(route);
    if (!tree.hash.hasOwnProperty(head)) {
        tree.hash[head] = eventTree();
    }

    if (route.length > 1) {
        return addCallback(_.rest(route), tree.hash[head], cb);
    }
    else if (route.length === 1) {
        tree.hash[head].funcs.push(cb);
    }
};

var execCallbacks = function (route, tree, msg) {
    var head = _.head(route);
    if (tree.hash.hasOwnProperty(head)) {
        if (route.length > 1) {
            return execCallbacks(_.rest(route), tree.hash[head], msg);
        }
        else if (route.length === 1) {
            return new Promise(function (resolve, reject) {
                _.each(tree.hash[head].funcs, function (cb) {
                    cb(msg);
                });
                return resolve(true);
            });
        }
    }
    else {
        return new Promise(function (resolve, reject) {
            return resolve(false);
        });
    }
};

var removeCallback = function (route, tree, f) {
    var head = _.head(route);
    if (tree.hash.hasOwnProperty(head)) {
        if (route.length > 1) {
            return removeCallback(_.rest(route), tree.hash[head], f);
        }
        else if (route.length === 1) {
            tree.hash[head].funcs = _.without(tree.hash[head].funcs, f);
        }
    }
};

var EventEmitter = function () {
    this._eventTree = eventTree();
};

_.extend(EventEmitter.prototype, {
    on: function (route, cb) {
        return addCallback(route, this._eventTree, cb);
    }
    , emit: function (route, msg) {
        return execCallbacks(route, this._eventTree, msg);
    } 
    , removeListener: function (route, f) {
        return removeCallback(route, this._eventTree, f);
    }
});

module.exports = {
    EventEmitter: EventEmitter
};
