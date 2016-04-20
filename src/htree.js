/*jslint node: true */
/* global -Promise */
"use strict";

// htree is a serializable embodiment of the hierarchical matching
// pattern, producing lists of items from routes with wild cards

var _ = require('lodash');

var htree = module.exports = {
    addItem: function (route, tree, item) {
        var head = _.head(route);
        if (!tree.hash.hasOwnProperty(head)) {
            tree.hash[head] = htree.create(tree.route.concat(head));
        }

        if (route.length > 1) {
            return htree.addItem(_.rest(route), tree.hash[head], item);
        }
        else if (route.length === 1) {
            tree.hash[head].items.push(item);
        }
    }
    , create: function (route) {
        route = route || [];
        return {
            hash: {}
            , items: []
            , route: route
        };
    }
    , items: function (route, eventTree) {
        var head = _.head(route);
        if (head === '**') {
            return allSubItems(eventTree);
        } else {
            var starListeners = [];
            var hash = eventTree.hash;
            var items;
            if (route.length > 1) {
                var rest = _.rest(route);
                if (head === '*') {
                    items = [].concat.apply([], _.map(hash, function (subtree, key) {
                        if (key === '*') {
                            starListeners = starListeners.concat(htree.items(rest, subtree));
                            return [];
                        } if (key == '**') {
                            starListeners = subtree.items.concat(starListeners);
                            return [];
                        } else {
                            return htree.items(rest, subtree);
                        }
                    }));
                    return [].concat.apply(starListeners, items);
                } else {
                    if (hash.hasOwnProperty('**')) {
                        starListeners = hash['**'].items;
                    }
                    if (hash.hasOwnProperty('*')) {
                        starListeners = starListeners.concat(htree.items(rest, hash['*']));
                    }
                    if (hash.hasOwnProperty(head)) {
                        return starListeners.concat(htree.items(rest, hash[head]));
                    }
                    else {
                        return starListeners;
                    }
                }
            } else {
                if (head === '*') {
                    items = [].concat.apply([], _.map(hash, function (subtree, key) {
                        if (key === '*') {
                            starListeners = starListeners.concat(subtree.items);
                            return [];
                        } if (key == '**') {
                            starListeners = subtree.items.concat(starListeners);
                            return [];
                        } else {
                            return subtree.items;
                        }
                    }));
                    return [].concat.apply(starListeners, items);
                } else {
                    if (hash.hasOwnProperty('**')) {
                        starListeners = hash['**'].items;
                    }
                    if (hash.hasOwnProperty('*')) {
                        starListeners = starListeners.concat(hash['*'].items);
                    }
                    if (hash.hasOwnProperty(head)) {
                        return starListeners.concat(hash[head].items);
                    } else {
                        return starListeners;
                    }
                }
            }
        }
    }
    , filterItems: function (route, tree, filter, onRemove) {
        var head = _.head(route);
        if (route.length > 1) {
            var rest = _.rest(route);
            if (head === '*') {
                return _.each(tree.hash, function (subtree, subhead) {
                    if (subhead !== '**') {
                        htree.filterItems(rest, subtree, filter, onRemove);
                        deleteIfEmpty(subhead, tree.hash);
                    }
                });
            }
            else if (tree.hash.hasOwnProperty(head)) {
                htree.filterItems(_.rest(route), tree.hash[head], filter, onRemove);
                deleteIfEmpty(head, tree.hash);            
            }
        }
        else if (route.length === 1) {
            if (head === '**')  {
                _.each(tree.hash, function (subtree, subhead) {
                    removeItems(subtree, filter, onRemove);
                    htree.filterItems(route, subtree, filter, onRemove);
                    deleteIfEmpty(subhead, tree.hash);
                });
            }
            if (head === '*') {
                _.each(tree.hash, function (subtree, subhead) {
                    if (subhead != '**') {
                        removeItems(subtree, filter, onRemove);
                        deleteIfEmpty(subhead, tree.hash);
                    }
                });
            }
            else if (tree.hash.hasOwnProperty(head)) {
                removeItems(tree.hash[head], filter, onRemove);
                deleteIfEmpty(head, tree.hash);
            }
        }
    }
};

var emptyTree = function (tree) {
    return tree.items.length === 0
        && _.isEmpty(tree.hash);
};

var deleteIfEmpty = function (target, hash) {
    if (emptyTree(hash[target])) {
        delete hash[target];
    }
};

var removeItems = function (tree, filter, onRemove) {
    var items = tree.items;
    var originalLength = items.length;
    var remainingItems = [];
    var removedItems = [];
    if (filter) {
        _.each(items, function (item) {
            if (filter(item)) {
                removedItems.push(item);
            } else {
                remainingItems.push(item);
            }
        });
    } else {
        removedItems = items;
        
    }
    tree.items = remainingItems;
    if (onRemove) {
        var route = tree.route;
        _.each(removedItems, function (item) {
            onRemove(route, item);
        });
    }
};

var allSubItems = function (eventTree) {
    var hash = eventTree.hash;
    var starListeners = [];
    var items = _.map(eventTree.hash, function (subtree, key) {
        if (key === '**') {
            starListeners = subtree.items.concat(starListeners);
            return [];
        }
        else if (key === '*') {
            starListeners = starListeners.concat(subtree.items.concat(allSubItems(subtree)));
            return [];
        } else {
            return subtree.items.concat(allSubItems(subtree));
        }
    });
    return [].concat.apply(starListeners, items);
};
