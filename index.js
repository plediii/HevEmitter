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

var execTree = function (tree, msg) {
    if (!tree || tree.funcs.length === 0) {
        return Promise.resolve(false);
    }
    return new Promise(function (resolve) {
        _.each(tree.funcs, function (cb) {
            cb(msg);
        });
        resolve(true);
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
                return execMatch(rest, subtree[1], msg);
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
        // return execCallbacks(route, this._eventTree, msg);
        return joinTwoExecutions(execTree(this._eventTree.hash['**'], msg)
                                 , execCallbacks(route, this._eventTree, msg));
    } 
    , removeListener: function (route, f) {
        return removeCallback(route, this._eventTree, f);
    }
});

module.exports = {
    EventEmitter: EventEmitter
};
