/*jslint node: true */
/* global -Promise */
"use strict";

var _ = require('lodash');

var eventTree = function () {
    return {
        hash: {}
        , funcs: []
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

var filterFuncs = function (funcs, f) {
    if (f) {
        return _.filter(funcs, function (func) {
            return func !== f && func.listener !== f;
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
            _.each(tree.hash, function (subtree, subhead) {
                removeFunc(subtree, f);
                removeCallback(route, subtree, f);
                deleteIfEmpty(subhead, tree.hash);
            });
        }
        if (head === '*') {
            _.each(tree.hash, function (subtree, subhead) {
                if (subhead != '**') {
                    removeFunc(subtree, f);
                    deleteIfEmpty(subhead, tree.hash);
                }
            });
        }
        else if (tree.hash.hasOwnProperty(head)) {
            removeFunc(tree.hash[head], f);
            deleteIfEmpty(head, tree.hash);
        }
    }
};

var allSubListeners = function (eventTree) {
    var hash = eventTree.hash;
    var starListeners = [];
    var funcs = _.map(eventTree.hash, function (subtree, key) {
        if (key === '**') {
            starListeners = subtree.funcs.concat(starListeners);
            return [];
        }
        else if (key === '*') {
            starListeners = starListeners.concat(subtree.funcs.concat(allSubListeners(subtree)));
            return [];
        } else {
            return subtree.funcs.concat(allSubListeners(subtree));
        }
    });
    return [].concat.apply(starListeners, funcs);
};

var listeners = function (route, eventTree) {
    var head = _.head(route);
    if (head === '**') {
        return allSubListeners(eventTree);
    } else {
        if (route.length > 1) {
            var hash = eventTree.hash;
            var rest = _.rest(route);
            if (head === '*') {
                var starListeners = [];
                var funcs = [].concat.apply([], _.map(hash, function (subtree, key) {
                    if (key === '*') {
                        starListeners = starListeners.concat(listeners(rest, subtree));
                        return [];
                    } if (key == '**') {
                        starListeners = subtree.funcs.concat(starListeners);
                        return [];
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
                if (hash.hasOwnProperty('*')) {
                    starListeners = starListeners.concat(listeners(rest, hash['*']));
                }
                if (hash.hasOwnProperty(head)) {
                    return starListeners.concat(listeners(rest, hash[head]));
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
                        starListeners = starListeners.concat(subtree.funcs);
                        return [];
                    } if (key == '**') {
                        starListeners = subtree.funcs.concat(starListeners);
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
};

var emit = function (eventTree, route, args) {
    var ls = listeners(route, eventTree);
    _.each(ls, function (f) {
        f.apply(null, args);
    });
    return ls.length > 0;
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
        route = this.parseRoute(route);
        if (route[0] === 'error') {
            if (route.length === 1) {
                route = route.concat('**');
            }
            removeCallback(route.slice(1), this._errorTree, f);
        }
        else if (route[0] === 'newListener') {
            if (route.length === 1) {
                route = route.concat('**');
            }
            removeCallback(route.slice(1), this._newListenerTree, f);
        }
        else {
            removeCallback(route, this._eventTree, f);
        }
        
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
    , list: function () {
        return list(this._eventTree, []);
    }
});

module.exports = {
    EventEmitter: EventEmitter
    , _: _
};
