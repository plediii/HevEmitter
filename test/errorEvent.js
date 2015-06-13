/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;

describe('HevEmitter error', function () {
    
    var h;
    beforeEach(function () {
        h = new H();
    });

    it('should trigger "error" listeners', function (done) {
        h.on(['error'], function () {
            done();
        });
        h.emit(['error']);
    });

    it('should *NOT* trigger * listeners', function (done) {
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
        h.on(['**'], function () {
            done(true);
        });
        h.on(['error'], function () {
            done();
        });
        h.emit(['error']);
    });

    it('should cause exception when there is no listener', function (done) {
        try {
            h.emit(['error']);
            return done(true);
        } catch (e) {
            return done();
        }
    });

    it('should allow sub listeners', function (done) {
        h.on(['error', 'smith'], function () {
            done(false);
        });
        h.on(['error', 'photo'], function () {
            done();
        });
        h.emit(['error', 'photo']);
    });

    it('should catch sub events on error', function (done) {
        h.on(['error'], function () {
            done();
        });
        h.emit(['error', 'photo']);
    });


});
