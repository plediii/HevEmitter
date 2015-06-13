/*jslint node: true */
"use strict";

module.exports = {

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
};
