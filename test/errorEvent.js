/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter error', function () {

    it('should trigger "error" listeners', function (done) {
        var h = new H();
        h.on(['error'], function () {
            done();
        });
        h.emit(['error']);
    });

    it('should *NOT* trigger * listeners', function (done) {
        var h = new H();
        h.on(['*'], function () {
            done(true);
        });
        h.on(['*', '*'], function () {
            done(true);
        });
        h.on(['error'], function () {
            done();
        });
        h.emit(['error'], function () {});
    });

    it('should NOT trigger ** events', function (done) {
        var h = new H();
        h.on(['**'], function () {
            done(true);
        });
        h.on(['error'], function () {
            done();
        });
        h.emit(['error']);
    });

    it('should cause exception when there is no listener', function (done) {
        var h = new H();
        h.emit(['error'])
        .catch(function () {
            done();
        });
    });

    it('should allow sub listeners', function (done) {
        var h = new H();
        h.on(['error', 'smith'], function () {
            done(false);
        });
        h.on(['error', 'photo'], function () {
            done();
        });
        h.emit(['error', 'photo']);
    });

    it('should catch sub events on error', function (done) {
        var h = new H();
        h.on(['error'], function () {
            done();
        });
        h.emit(['error', 'photo']);
    });


});
