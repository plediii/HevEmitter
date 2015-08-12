/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter callback order', function () {
    
    var h;
    beforeEach(function () {
        h = new H();
    });

    var calledInOrderOfAddition = function (onRoute, emitRoute) {
        it('should trigger in order of adding to "' + onRoute.join('/') + '" when emitting to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: [] };
            h.on(onRoute, function (msg) {
                msg.emitted.push('a');
            });
            h.on(onRoute, function (msg) {
                msg.emitted.push('b');
            });
            assert(h.emit(emitRoute, msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });
    };


    _.each(routes.matchRoutes, function (args) {
        calledInOrderOfAddition.apply(null, args);
    });

});
