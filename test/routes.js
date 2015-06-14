/*jslint node: true */
"use strict";

var _ = require('lodash');


var routes = module.exports = {
    matchRoutes: [
        [['name'], ['name']]
        , [['name'], ['*']]
        , [['name'], ['**']]
        , [['*'], ['name']]
        , [['*'], ['*']]
        , [['*'], ['**']]
        , [['**'], ['name']]
        , [['**'], ['*']]
        , [['**'], ['**']]

        , [['name', 'name2'], ['name', 'name2']]
        , [['name', 'name2'], ['*', 'name2']]
        , [['name', 'name2'], ['name', '*']]
        , [['name', 'name2'], ['**']]
        , [['name', 'name2'], ['name', '**']]

        , [['*', 'name2'], ['name', 'name2']]
        , [['*', 'name2'], ['*', 'name2']]
        , [['*', 'name2'], ['name', '*']]
        , [['*', 'name2'], ['**']]
        , [['*', 'name2'], ['name', '**']]

        , [['name', '*'], ['name', 'name2']]
        , [['name', '*'], ['*', 'name2']]
        , [['name', '*'], ['name', '*']]
        , [['name', '*'], ['**']]
        , [['name', '*'], ['name', '**']]

        , [['**'], ['name', 'name2']]
        , [['**'], ['*', 'name2']]
        , [['**'], ['name', '*']]
        , [['**'], ['**']]
        , [['**'], ['name', '**']]
    ]
    , notMatchRoutes: [
        [['name'], ['otherName']]
        , [['name'], ['name', '**']]

        , [['name', 'otherName'], ['name', 'anotherName']]
        , [['otherName', 'name'], ['anotherName', 'name']]
        , [['name', 'name2'], ['*', 'anotherName']]
        , [['name', 'name2'], ['anotherName', '*']]
        , [['name', 'name2'], ['anotherName', '**']]

        , [['*', 'name2'], ['name', 'anotherName']]
        , [['*', 'name2'], ['*', 'anotherName']]

        , [['name', '*'], ['anotherName', 'name2']]
        , [['name', '*'], ['anotherName', '*']]
        , [['name', '*'], ['anotherName', '**']]

        , [['name', 'name2'], ['name', 'name2', '**']]
        , [['name', 'name2'], ['*', 'name2', '**']]
        , [['name', 'name2'], ['name', '*', '**']]

        , [['*', 'name2'], ['name', 'name2', '**']]
        , [['*', 'name2'], ['*', 'name2', '**']]
        , [['*', 'name2'], ['name', '*', '**']]

        , [['name', '*'], ['name', 'name2', '**']]
        , [['name', '*'], ['*', 'name2', '**']]
        , [['name', '*'], ['name', '*', '**']]

        , [['name', 'name2', '**'], ['name', 'name2']]
        , [['name', 'name2', '**'], ['*', 'name2']]
        , [['name', 'name2', '**'], ['name', '*']]

        , [['*', 'name2', '**'], ['name', 'name2']]
        , [['*', 'name2', '**'], ['*', 'name2']]
        , [['*', 'name2', '**'], ['name', '*']]

        , [['name', '*', '**'], ['name', 'name2']]
        , [['name', '*', '**'], ['*', 'name2']]
        , [['name', '*', '**'], ['name', '*']]

        // 'newListener' is a special event type
        , [['newListener'], ['name']]
        , [['newListener'], ['*']]
        , [['newListener'], ['**']]
        , [['newListener', 'name'], ['*', 'othername']]
        , [['newListener', 'name'], ['*', 'name']]
        , [['newListener', 'name'], ['*', '*']]
        , [['newListener', '*'], ['*', 'name']]
        , [['newListener', '*'], ['*', '*']]
        , [['newListener', '*'], ['*', '**']]
        , [['newListener', '**'], ['*', 'name']]
        , [['newListener', '**'], ['*', '*']]
        , [['newListener', '**'], ['*', '**']]
        , [['newListener'], ['newListener']]
        , [['newListener'], ['newListener', 'name']]
        , [['newListener'], ['newListener', 'name', 'name2']]
        , [['newListener', 'name'], ['newListener', 'name']]
        , [['newListener', '*'], ['newListener', 'name']]
        , [['newListener', '*', '*'], ['newListener', 'name', 'name2']]
        , [['newListener', '**'], ['newListener', 'name']]
        , [['newListener', '**'], ['newListener', 'name', 'name2']]
    ]
    , matchOrders: [
        [['*'], ['name'], ['name']]
        , [['**'], ['name'], ['name']]
        , [['**'], ['*'], ['name']]

        , [['*'], ['name'], ['*']]
        , [['**'], ['name'], ['*']]
        , [['**'], ['*'], ['*']]

        , [['*'], ['name'], ['**']]
        , [['**'], ['name'], ['**']]
        , [['**'], ['*'], ['**']]


        , [['name', '*'], ['name', 'name'], ['name', 'name']]
        , [['*', 'name'], ['name', 'name'], ['name', 'name']]
        , [['*', '*'], ['name', 'name'], ['name', 'name']]
        , [['name', '**'], ['name', 'name'], ['name', 'name']]
        , [['*', '**'], ['name', 'name'], ['name', 'name']]
        , [['**'], ['name', 'name'], ['name', 'name']]

        , [['*', 'name'], ['name', '*'], ['name', 'name']]
        , [['*', '*'], ['name', '*'], ['name', 'name']]
        , [['name', '**'], ['name', '*'], ['name', 'name']]
        , [['*', '**'], ['name', '*'], ['name', 'name']]
        , [['**'], ['name', '*'], ['name', 'name']]

        , [['*', '*'], ['*', 'name'], ['name', 'name']]
        , [['*', '**'], ['*', 'name'], ['name', 'name']]
        , [['**'], ['*', 'name'], ['name', 'name']]

        , [['*', '**'], ['name', '**'], ['name', 'name']]
        , [['**'], ['name', '**'], ['name', 'name']]


        , [['name', '*'], ['name', 'name'], ['name', '*']]
        , [['*', 'name'], ['name', 'name'], ['name', '*']]
        , [['*', '*'], ['name', 'name'], ['name', '*']]
        , [['name', '**'], ['name', 'name'], ['name', '*']]
        , [['*', '**'], ['name', 'name'], ['name', '*']]
        , [['**'], ['name', 'name'], ['name', '*']]

        , [['*', 'name'], ['name', '*'], ['name', '*']]
        , [['*', '*'], ['name', '*'], ['name', '*']]
        , [['name', '**'], ['name', '*'], ['name', '*']]
        , [['*', '**'], ['name', '*'], ['name', '*']]
        , [['**'], ['name', '*'], ['name', '*']]

        , [['*', '*'], ['*', 'name'], ['name', '*']]
        , [['*', '**'], ['*', 'name'], ['name', '*']]
        , [['**'], ['*', 'name'], ['name', '*']]

        , [['*', '**'], ['name', '**'], ['name', '*']]
        , [['**'], ['name', '**'], ['name', '*']]


        , [['name', '*'], ['name', 'name'], ['*', 'name']]
        , [['*', 'name'], ['name', 'name'], ['*', 'name']]
        , [['*', '*'], ['name', 'name'], ['*', 'name']]
        , [['name', '**'], ['name', 'name'], ['*', 'name']]
        , [['*', '**'], ['name', 'name'], ['*', 'name']]
        , [['**'], ['name', 'name'], ['*', 'name']]

        , [['*', 'name'], ['name', '*'], ['*', 'name']]
        , [['*', '*'], ['name', '*'], ['*', 'name']]
        , [['name', '**'], ['name', '*'], ['*', 'name']]
        , [['*', '**'], ['name', '*'], ['*', 'name']]
        , [['**'], ['name', '*'], ['*', 'name']]

        , [['*', '*'], ['*', 'name'], ['*', 'name']]
        , [['*', '**'], ['*', 'name'], ['*', 'name']]
        , [['**'], ['*', 'name'], ['*', 'name']]

        , [['*', '**'], ['name', '**'], ['*', 'name']]
        , [['**'], ['name', '**'], ['*', 'name']]



        , [['name', '*'], ['name', 'name'], ['**']]
        , [['*', 'name'], ['name', 'name'], ['**']]
        , [['*', '*'], ['name', 'name'], ['**']]
        , [['name', '**'], ['name', 'name'], ['**']]
        , [['*', '**'], ['name', 'name'], ['**']]
        , [['**'], ['name', 'name'], ['**']]

        , [['*', 'name'], ['name', '*'], ['**']]
        , [['*', '*'], ['name', '*'], ['**']]
        , [['name', '**'], ['name', '*'], ['**']]
        , [['*', '**'], ['name', '*'], ['**']]
        , [['**'], ['name', '*'], ['**']]

        , [['*', '*'], ['*', 'name'], ['**']]
        , [['*', '**'], ['*', 'name'], ['**']]
        , [['**'], ['*', 'name'], ['**']]

        , [['*', '**'], ['name', '**'], ['**']]
        , [['**'], ['name', '**'], ['**']]
    ]
    , deleteRoutes: [
        [['name'], ['name']]
        , [['name'], ['*']]
        , [['name'], ['**']]
        , [['*'], ['*']]
        , [['*'], ['**']]
        , [['**'], ['**']]

        , [['name', 'name2'], ['name', 'name2']]
        , [['name', 'name2'], ['*', 'name2']]
        , [['name', 'name2'], ['name', '*']]
        , [['name', 'name2'], ['*', '*']]
        , [['name', 'name2'], ['*', '**']]
        , [['name', 'name2'], ['**']]
        , [['name', 'name2'], ['name', '**']]

        , [['*', 'name2'], ['*', 'name2']]
        , [['*', 'name2'], ['*', '*']]
        , [['*', 'name2'], ['*', '**']]
        , [['*', 'name2'], ['**']]

        , [['name', '*'], ['name', '*']]
        , [['name', '*'], ['*', '*']]
        , [['name', '*'], ['*', '**']]
        , [['name', '*'], ['**']]
        , [['name', '*'], ['name', '**']]

        , [['**'], ['**']]
    ]
    , notDeleteRoutes: [
        [['*'], ['name']]
        , [['**'], ['name']]
        , [['**'], ['*']]

        , [['*', 'name2'], ['name', 'name2']]
        , [['*', 'name2'], ['name', '*']]
        , [['*', 'name2'], ['name', '**']]

        , [['name', '*'], ['name', 'name2']]

        , [['**'], ['name', 'name2']]
        , [['**'], ['*', 'name2']]
        , [['**'], ['name', '*']]
        , [['**'], ['name', '**']]

        , [['name'], ['otherName']]
        , [['name'], ['name', '**']]

        , [['name', 'otherName'], ['name', 'anotherName']]
        , [['otherName', 'name'], ['anotherName', 'name']]
        , [['name', 'name2'], ['*', 'anotherName']]
        , [['name', 'name2'], ['anotherName', '*']]
        , [['name', 'name2'], ['anotherName', '**']]

        , [['*', 'name2'], ['name', 'anotherName']]
        , [['*', 'name2'], ['*', 'anotherName']]

        , [['name', '*'], ['anotherName', 'name2']]
        , [['name', '*'], ['anotherName', '*']]
        , [['name', '*'], ['anotherName', '**']]

        , [['name', 'name2'], ['name', 'name2', '**']]
        , [['name', 'name2'], ['*', 'name2', '**']]
        , [['name', 'name2'], ['name', '*', '**']]

        , [['*', 'name2'], ['name', 'name2', '**']]
        , [['*', 'name2'], ['*', 'name2', '**']]
        , [['*', 'name2'], ['name', '*', '**']]

        , [['name', '*'], ['name', 'name2', '**']]
        , [['name', '*'], ['*', 'name2', '**']]
        , [['name', '*'], ['name', '*', '**']]

        , [['name', 'name2', '**'], ['name', 'name2']]
        , [['name', 'name2', '**'], ['*', 'name2']]
        , [['name', 'name2', '**'], ['name', '*']]

        , [['*', 'name2', '**'], ['name', 'name2']]
        , [['*', 'name2', '**'], ['*', 'name2']]
        , [['*', 'name2', '**'], ['name', '*']]

        , [['name', '*', '**'], ['name', 'name2']]
        , [['name', '*', '**'], ['*', 'name2']]
        , [['name', '*', '**'], ['name', '*']]

    ]
};
