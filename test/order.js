/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter callback order', function () {

    it('should trigger .on/.once callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.on(['duras'], function () {
            reports.push('on');
        });
        h.once(['duras'], function () {
            reports.push('once');
        });
        h.emit(['duras'])
        .then(function () {
            assert.deepEqual(['on', 'once'], reports);
            done();
        });
    });

    it('should trigger .once/.on callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.once(['duras'], function () {
            reports.push('once');
        });
        h.on(['duras'], function () {
            reports.push('on');
        });
        h.emit(['duras'])
        .then(function () {
            assert.deepEqual(['once', 'on'], reports);
            done();
        });
    });

    it('should trigger .on/promise callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.on(['kales'], function () {
            reports.push('on');
        });
        h.on(['kales'], function (msg, cb) {
            reports.push('promise');
            cb();
        });
        h.emit(['kales'])
        .then(function () {
            assert.deepEqual(['on', 'promise'], reports);
            done();
        });
    });

    it('should trigger promise/.on callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.on(['kales'], function (msg, cb) {
            reports.push('promise');
            cb();
        });
        h.on(['kales'], function () {
            reports.push('on');
        });
        h.emit(['kales'])
        .then(function () {
            assert.deepEqual(['promise', 'on'], reports);
            done();
        });
    });


    it('should trigger .once/promise callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.once(['kitamer'], function () {
            reports.push('once');
        });
        h.on(['kitamer'], function (msg, cb) {
            reports.push('promise');
            cb();
        });
        h.emit(['kitamer'])
        .then(function () {
            assert.deepEqual(['once', 'promise'], reports);
            done();
        });
    });

    it('should trigger promise/.once callback in order of addition', function (done) {
        var h = new H();
        var reports = [];
        h.on(['kitamer'], function (msg, cb) {
            reports.push('promise');
            cb();
        });
        h.once(['kitamer'], function () {
            reports.push('once');
        });
        h.emit(['kitamer'])
        .then(function () {
            assert.deepEqual(['promise', 'once'], reports);
            done();
        });
    });


});
