/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter newlistener', function () {

    it('should be triggered when a listener is added to a "name" event', function (done) {
        var h = new H();
        h.on(['newListener'], function () {
            done();
        });
        h.on(['star'], function () {});
    });

    it('should be triggered when a listener is added to a "name" event, with data', function (done) {
        var h = new H();
        h.on(['newListener'], function (data) {
            assert(data);
            done();
        });
        h.on(['star'], function () {});
    });


    it('should be triggered when a listener is added to a "name" event, with data.event equal to the listened to event', function (done) {
        var h = new H();
        h.on(['newListener'], function (data) {
            assert.deepEqual(data.event, ['star']);
            done();
        });
        h.on(['star'], function () {});
    });

    it('should be triggered when a listener is added to a "name" event, with data.listener equal to the listener function', function (done) {
        var h = new H();
        var listener = function () {};
        h.on(['newListener'], function (data) {
            assert.equal(data.listener, listener);
            done();
        });
        h.on(['star'], listener);
    });

});
