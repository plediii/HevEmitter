/*jslint node: true */
/* global -Promise */
"use strict";

var _ = require('lodash');
var Promise = require('bluebird');

var eventTree = function () {
    return {
        hash: {}
        , funcs: []
    };
};

var chainExecutions = function () {
    var ps = _.toArray(arguments);

    var execution = Promise.reduce(ps, function (called, p) {
        var result = p();
        if (result.isPending()) {
            return result.then(function (fcalled) {
                return called || fcalled;
            });
        }
        else {
            if (result.isRejected()) {
                return result;
            }
            else {
                return Promise.resolve(called || result.value());
            }
        }
    }, false);
    return execution;
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
    if (!tree || (tree.funcs.length === 0)) {
        return Promise.resolve(false);
    }
    var funcs = tree.funcs;
    var execution = Promise.reduce(funcs, function (called, f) {
        return f(msg);
    }, false);
    if (execution.isPending()) {
        return execution.then(true);
    }
    else {
        if (execution.isRejected()) {
            return execution;
        }
        else {
            return Promise.resolve(true);
        }
    }
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
    return chainExecutions(
        function () {
            return execTree(tree, msg);
        }
        , function () {
            return applySubTrees(tree, function (subtree) {
                return execAll(subtree, msg);
            });
        }
    );
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
            return chainExecutions(function () {
                return execTree(tree.hash['*'] && tree.hash['*'].hash['**'], msg);
            }, function () {
                return execTree(matchTree && matchTree.hash['**'], msg);
            }, function () {
                return execCallbacks(rest, tree.hash['*'], msg);
            }, function () {
                return execCallbacks(rest, matchTree, msg);
            });
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
            return chainExecutions(function () {
                return execMatch('*', tree, msg);
            }, function () {
                return execMatch(head, tree, msg);
            });
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
        f = function (msg) {
            return new Promise(function (resolve, reject) {
                return cb(msg, function (abort) {
                    if (abort) {
                        reject({
                            message: abort
                        });
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        };
    }
    else {
        f = function (msg) {
            cb(msg);
            return Promise.resolve(true);
        };
    }
    f.listener = cb.listener || cb;
    return f;
};

var allListeners = function (eventTree) {
    var listeners = [];
    var hash = eventTree.hash;
    if (hash.hasOwnProperty('**')) {
        listeners = hash['**'].funcs;
    }
    if (hash.hasOwnProperty('*')) {
        listeners = listeners.concat(hash['*'].funcs);
    }
    return [].concat.apply(listeners, _.map(eventTree.hash, function (subtree, key) {
        if (key !== '**' && key != '*') {
            return [].concat.apply(subtree.funcs, allListeners(subtree));
        } else {
            return [];
        }
    }));
};

var listenerFuncs = function (funcs) {
    return _.map(funcs, function (f) {
        return f.listener || f;
    });
};

var listeners = function (route, eventTree) {
    var head = _.head(route);
    if (head === '**') {
        return allListeners(eventTree);
    } else {
        if (route.length > 1) {
            var hash = eventTree.hash;
            var rest = _.rest(route);
            if (head === '*') {
                var starListeners = [];
                var funcs = [].concat.apply([], _.map(hash, function (subtree, key) {
                    if (key === '*') {
                        starListeners = listeners(rest, subtree).concat(starListeners);
                        return [];
                    // } if (key == '**') {
                    //     starListeners = starListeners.concat(subtree.funcs);
                    //     return [];
                    } else {
                        return listeners(rest, subtree);
                    }
                }));
                return [].concat.apply(starListeners, funcs);
            } else {
                var starListeners = [];
                if (hash.hasOwnProperty('**')) {
                    starListeners = hash['**'].funcs;
                }
                if (hash.hasOwnProperty(head)) {
                    return listeners(rest, hash[head]);
                }
                else {
                    return starListeners;
                }
            }
        } else {
            var hash = eventTree.hash;
            if (head === '*') {
                var starListeners = [];
                var funcs = [].concat.apply([], _.map(hash, function (subtree, key) {
                    if (key === '*') {
                        starListeners = subtree.funcs.concat(starListeners);
                        return [];
                    } if (key == '**') {
                        starListeners = starListeners.concat(subtree.funcs);
                        return [];
                    } else {
                        return subtree.funcs;
                    }
                }));
                return [].concat.apply(starListeners, funcs);
            } else {
                var hash = eventTree.hash;
                var starListeners = [];
                if (hash.hasOwnProperty('**')) {
                    starListeners = hash['**'].funcs;
                }
                if (hash.hasOwnProperty('*')) {
                    starListeners = starListeners.concat(hash['*'].funcs);
                }
                if (hash.hasOwnProperty(head)) {
                    return starListeners.concat(hash[head].funcs);
                } else {
                    return starListeners;
                }
            }
        }
    }

    if (route.length > 1) {
        var rest = _.rest(route);
        if (head == '*') {
            var funcs = eventTree.funcs;
            if (rest[0] == '**') {
                return [].concat.apply(funcs, _.map(eventTree.hash, function (subtree) {
                    return allListeners(subtree);
                }));                
            }
            else {
                return [].concat.apply(funcs, _.map(eventTree.hash, function (subtree) {
                    return listeners(rest, subtree);
                }));
            }
        }
        else {
            starListeners = [];
            if (eventTree.hash.hasOwnProperty('**')) {
                starListeners = starListeners.concat(listeners(rest, eventTree.hash['**']));
            }
            if (eventTree.hash.hasOwnProperty('*')) {
                starListeners = starListeners.concat(listeners(rest, eventTree.hash['*']));
            }
            if (eventTree.hash.hasOwnProperty(head)) {
                if (rest[0] == '**') {
                    return starListeners.concat(allListeners(eventTree.hash[head]));
                }
                else {
                    return starListeners.concat(listeners(rest, eventTree.hash[head]));
                }
            }
            else {
                return starListeners;
            }
        }
    }
    else {
        if (head == '*') {
            return [].concat.apply(eventTree.funcs, _.map(eventTree.hash, function (subtree, name) {
                if (name == '**') {
                    return [];
                }
                else {
                    return subtree.funcs;
                }
            }));
        }
        else {
            starListeners = [];
            if (eventTree.hash.hasOwnProperty('*')) {
                starListeners = starListeners.concat(eventTree.hash['*'].funcs);
            }

            if (eventTree.hash.hasOwnProperty(head)) {
                return starListeners.concat(eventTree.hash[head].funcs);
            }
            else {
                return starListeners;
            }
        }
    }
};

var emit = function (eventTree, route, msg) {
    return chainExecutions(
        function () {
            return execTree(eventTree.hash['**'], msg);
        }
        , function () {
            return execCallbacks(route, eventTree, msg);
        });
};

var list = function (eventTree, parent) {
    var l = [];
    if (eventTree.funcs.length > 0) {
        l = [parent.join('/')];
    }
    return [].concat.apply(l, _.map(eventTree.hash, function (subtree, name) {
        return list(subtree, parent.concat(name));
    }));
};

var EventEmitter = function (options) {
    options = _.defaults({}, options, {
        delimiter: '/'
    });
    this._eventTree = eventTree();
    this._newListenerTree = eventTree();
    this._errorTree = eventTree();
    this.delimiter = options.delimiter;
};

_.extend(EventEmitter.prototype, {
    parseRoute: function (route) {
        if (_.isString(route))  {
            route = route.split(this.delimiter);
        }
        return route;
    }
    , on: function (route, cb) {
        route = this.parseRoute(route);
        if (route.length === 1
            && (route[0] === 'newListener'
                || route[0] === 'error')) {
            route = route.concat('**');
        }
        emit(this._newListenerTree, route, {
            event: route
            , listener: cb
        });
        if (route[0] === 'newListener') {
            addCallback(route.slice(1), this._newListenerTree, cb);
        }
        else if (route[0] === 'error') {
            addCallback(route.slice(1), this._errorTree, cb);
        }
        else {
            addCallback(route, this._eventTree, cb);
        }
    }
    , emit: function (route, msg) {
        var _this = this;
        route = this.parseRoute(route);
        if (route[0] === 'newListener') {
            return emit(_this.newListenerTree, route.slice(1), msg);
        }
        else if (route[0] === 'error') {
            return emit(_this._errorTree, route.slice(1), msg)
            .then(function (called) {
                if (!called) {
                    if (msg instanceof Error) {
                        throw msg; // Unhandled 'error' event
                    }
                    else {
                        throw new Error('Uncaught unspecified error event.');
                    }
                }
                return true;
            });
        }
        else {
            return emit(_this._eventTree, route, msg);
        }
    } 
    , removeListener: function (route, f) {
        route = this.parseRoute(route);
        removeCallback(route, this._eventTree, f);
    }
    , once: function (route, cb) {
        route = this.parseRoute(route);
        var _this = this;
        var f = adaptCallback(cb);
        var g = function (msg) {
            _this.removeListener(route, cb);
            return f(msg);
        };
        g.listener = cb;
        emit(this._newListenerTree, route, {
            event: route
            , listener: cb
        });
        return addCallback(route, this._eventTree, g);
    }
    , removeAllListeners: function (route) {
        route = this.parseRoute(route);
        if (route[0] === '**') {
            this._eventTree = eventTree();
        }
        else {
            removeCallback(route, this._eventTree);
        }
    }
    , listeners: function (route) {
        route = this.parseRoute(route);
        return listeners(route, this._eventTree);
    }
    , list: function () {
        return list(this._eventTree, []);
    }
});

module.exports = {
    EventEmitter: EventEmitter
};
