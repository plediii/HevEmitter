/*jslint node: true */
"use strict";

var _ = require('underscore');
var Promise = require('bluebird');

var eventTree = function () {
    return {
        hash: {}
        , funcs: []
        , onces: []
        , promises: []
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
        if (once) {
            tree.hash[head].onces.push(cb);
        }
        else {
            if (cb.length === 2) {
                tree.hash[head].promises.push(Promise.promisify(cb));
            }
            else {
                tree.hash[head].funcs.push(cb);
            }
        }
    }
};

var promisifyArray = function (arr) {
    return _.map(arr, function (f) {
        return Promise.promisify(f);
    });
};

var any = function (arr) {
    return _.any(arr);
};

var execTree = function (tree, msg) {
    if (!tree || (tree.funcs.length === 0 
                  && tree.onces.length === 0
                  && tree.promises.length === 0)) {
        return Promise.resolve(false);
    }

    return Promise.all(_.map(tree.promises, function (p) {
        return p(msg);
    }))
        .then(function () {
            _.each(tree.funcs, function (cb) {
                cb(msg);
            });
            var onces = tree.onces;
            tree.onces = [];
            _.each(onces, function (cb) {
                cb(msg);
            });
            return true;
        });
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

var joinTwoExecutions = function (left, right) {
    return Promise.join(left, right, function (l, r) {
        return l || r;
    });
};

var joinThreeExecutions = function (left, mid, right) {
    return Promise.join(left, mid, right, function (l, m, r) {
        return l || m || r;
    });
};


var execAll = function (tree, msg) {
    var subTreeExecution = applySubTrees(tree, function (subtree) {
        return execAll(subtree, msg);
    });
    return joinTwoExecutions(execTree(tree, msg)
                            , subTreeExecution);
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
    return joinTwoExecutions(execTree(targetTree, msg)
                            , execTree(doubleStarTree, msg));
};

var anyExecutions = function (executions) {
    return _.any(executions);
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
                return execCallbacks(rest, subtree, msg);
            })
                .then(anyExecutions);    
        }
        else {
            var matchTree = tree.hash.hasOwnProperty(head) && tree.hash[head];
            return Promise.join(execTree(tree.hash['*'] && tree.hash['*'].hash['**'], msg)
                               , execTree(matchTree && matchTree.hash['**'], msg)
                               , execCallbacks(rest, tree.hash['*'], msg)
                               , execCallbacks(rest, matchTree, msg), function () {
                                   return _.any(arguments);
                               });
        }
    }
    else if (route.length === 1) {
        if (head === '*') {
            return applySubTrees(tree, function (subtree) {
                return execTree(subtree, msg);
            })
                .then(anyExecutions);    
        }
        else {
            return joinTwoExecutions(execMatch('*', tree, msg)
                                     , execMatch(head, tree, msg));
        }
    }
    else {
        return noExecution();
    }
};

var filterFuncs = function (funcs, f) {
    if (f) {
        return _.without(funcs, f);
    }
    else {
        return [];
    }
};

var emptyTree = function (tree) {
    return tree.funcs.length === 0
        && tree.onces.length === 0
        && _.isEmpty(tree.hash);
};

var deleteIfEmpty = function (target, hash) {
    if (emptyTree(hash[target])) {
        delete hash[target];
    }
};

var removeFunc = function (tree, f) {
    tree.funcs = filterFuncs(tree.funcs, f);
    tree.onces = filterFuncs(tree.onces, f);
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

var EventEmitter = function () {
    this._eventTree = eventTree();
};

_.extend(EventEmitter.prototype, {
    on: function (route, cb) {
        return addCallback(false, route, this._eventTree, cb);
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
        return addCallback(true, route, this._eventTree, cb);
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
