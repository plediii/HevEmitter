/*jslint node: true */
"use strict";

var _ = require('underscore');
var Promise = require('bluebird');

var eventTree = function () {
    return {
        hash: {}
        , funcs: []
    };
};

var addCallback = function (once, route, tree, cb) {
    var head = _.head(route);
    if (!tree.hash.hasOwnProperty(head)) {
        tree.hash[head] = eventTree();
    }

    if (route.length > 1) {
        return addCallback(once, _.rest(route), tree.hash[head], cb);
    }
    else if (route.length === 1) {
        tree.hash[head].funcs.push(cb);
    }
};

var execTree = function (tree, msg) {
    if (!tree || (tree.funcs.length === 0)) {
        return Promise.resolve(false);
    }

    return Promise.all(_.map(tree.funcs, function (p) {
        return p(msg);
    }));
};

var applySubTrees = function (tree, method) {
    return Promise.map(_.pairs(tree.hash)
                       , function (kv) {
                           if (kv[0] === '**') {
                               return false;
                           }
                           else {
                               return method(kv[1]);
                           }
                       }, {concurrency: 1});
};



var execAll = function (tree, msg) {
    var subTreeExecution = applySubTrees(tree, function (subtree) {
        return execAll(subtree, msg);
    });
    return Promise.join(execTree(tree, msg)
                       , subTreeExecution)
        .then(_.any);
};

var execMatch = function (target, tree, msg) {
    if (!tree) {
        return Promise.resolve(false);
    }
    var targetTree = tree.hash.hasOwnProperty(target) && tree.hash[target];
    if (!targetTree) {
        return Promise.resolve(false);
    }
    var doubleStarTree = targetTree.hash['**'];
    return Promise.join(execTree(targetTree, msg)
                        , execTree(doubleStarTree, msg))
        .then(_.any);
};

var noExecution = function () {
    return Promise.resolve(false);
};

var execCallbacks = function (route, tree, msg) {
    if (!tree) {
        return noExecution();
    }
    var head = _.head(route);
    if (head === '**') {
        return execAll(tree, msg);
    }
    else if (route.length > 1) {
        var rest = _.rest(route);
        if (head === '*') {
            return applySubTrees(tree, function (subtree) {
                return Promise.join(execTree(subtree.hash['**'], msg)
                                    , execCallbacks(rest, subtree, msg))
                    .then(_.any);
            });
        }
        else {
            var matchTree = tree.hash.hasOwnProperty(head) && tree.hash[head];
            return Promise.join(execTree(tree.hash['*'] && tree.hash['*'].hash['**'], msg)
                               , execTree(matchTree && matchTree.hash['**'], msg)
                               , execCallbacks(rest, tree.hash['*'], msg)
                               , execCallbacks(rest, matchTree, msg))
                .then(_.any)
        }
    }
    else if (route.length === 1) {
        if (head === '*') {
            return applySubTrees(tree, function (subtree) {
                return execTree(subtree, msg);
            })
                .then(_.any);    
        }
        else {
            return Promise.join(execMatch('*', tree, msg)
                                , execMatch(head, tree, msg))
            .then(_.any);
        }
    }
    else {
        return noExecution();
    }
};

var filterFuncs = function (funcs, f) {
    if (f) {
        return _.filter(funcs, function (func) {
            return func.listener !== f;
        });
    }
    else {
        return [];
    }
};

var emptyTree = function (tree) {
    return tree.funcs.length === 0
        && _.isEmpty(tree.hash);
};

var deleteIfEmpty = function (target, hash) {
    if (emptyTree(hash[target])) {
        delete hash[target];
    }
};

var removeFunc = function (tree, f) {
    tree.funcs = filterFuncs(tree.funcs, f);
};

var removeCallback = function (route, tree, f) {
    var head = _.head(route);
    if (route.length > 1) {
        var rest = _.rest(route);
        if (head === '*') {
            return _.each(tree.hash, function (subtree, subhead) {
                if (subhead !== '**') {
                    removeCallback(rest, subtree, f);
                    deleteIfEmpty(subhead, tree.hash);
                }
            });
        }
        else if (tree.hash.hasOwnProperty(head)) {
            removeCallback(_.rest(route), tree.hash[head], f);
            deleteIfEmpty(head, tree.hash);            
        }
    }
    else if (route.length === 1) {
        if (head === '**')  {
            removeFunc(tree, f);
            _.each(tree.hash, function (subtree, subhead) {
                removeCallback(route, subtree, f);
                deleteIfEmpty(subhead, tree.hash);
            });
        }
        if (head === '*') {
            _.each(tree.hash, function (subtree, subhead) {
                removeFunc(subtree, f);
                deleteIfEmpty(subhead, tree.hash);
            });
        }
        else if (tree.hash.hasOwnProperty(head)) {
            removeFunc(tree.hash[head], f);
            deleteIfEmpty(head, tree.hash);
        }
    }
};

var adaptCallback = function (cb) {
    var f;
    if (cb.length === 2) {
        f = Promise.promisify(cb);
    }
    else {
        f = function (msg) {
            cb(msg);
            return Promise.resolve(false);
        };
    }
    f.listener = cb;
    return f;
};

var EventEmitter = function () {
    this._eventTree = eventTree();
};

_.extend(EventEmitter.prototype, {
    on: function (route, cb) {
        return addCallback(false, route, this._eventTree, adaptCallback(cb));
    }
    , emit: function (route, msg) {
        var _this = this;
        return execTree(_this._eventTree.hash['**'], msg)
        .then(function (l) {
            return execCallbacks(route, _this._eventTree, msg)
            .then(function (r) {
                return l || r;
            });
        });
    } 
    , removeListener: function (route, f) {
        removeCallback(route, this._eventTree, f);
    }
    , once: function (route, cb) {
        var _this = this;
        var f = adaptCallback(cb);
        var fired = false;
        var g = function (msg) {
            if (!fired) {
                _this.removeListener(route, cb);
                return f(msg);
            }
            else {
                return Promise.resolve(false);
            }
        };
        g.listener = cb;
        return addCallback(false, route, this._eventTree, g);
    }
    , removeAllListeners: function (route) {
        if (route[0] === '**') {
            this._eventTree = eventTree();
        }
        else {
            removeCallback(route, this._eventTree);
        }
    }
});

module.exports = {
    EventEmitter: EventEmitter
};
