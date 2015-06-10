/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter callback order', function () {

    it('should trigger .on/.once callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.on(['duras'], function () {
            reports.push('on');
        });
        h.once(['duras'], function () {
            reports.push('once');
        });
        h.emit(['duras']);
        assert.deepEqual(['on', 'once'], reports);
    });

    it('should trigger .once/.on callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.once(['duras'], function () {
            reports.push('once');
        });
        h.on(['duras'], function () {
            reports.push('on');
        });
        h.emit(['duras']);
        assert.deepEqual(['once', 'on'], reports);
    });

    it('should trigger .on/promise callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.on(['kales'], function () {
            reports.push('on');
        });
        h.on(['kales'], function () {
            reports.push('promise');
        });
        h.emit(['kales']);
        assert.deepEqual(['on', 'promise'], reports);
    });

    it('should trigger promise/.on callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.on(['kales'], function () {
            reports.push('promise');
        });
        h.on(['kales'], function () {
            reports.push('on');
        });
        h.emit(['kales']);
        assert.deepEqual(['promise', 'on'], reports);
    });


    it('should trigger .once/promise callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.once(['kitamer'], function () {
            reports.push('once');
        });
        h.on(['kitamer'], function () {
            reports.push('promise');
        });
        h.emit(['kitamer']);
        assert.deepEqual(['once', 'promise'], reports);
    });

    it('should trigger promise/.once callback in order of addition', function () {
        var h = new H();
        var reports = [];
        h.on(['kitamer'], function () {
            reports.push('promise');
        });
        h.once(['kitamer'], function () {
            reports.push('once');
        });
        h.emit(['kitamer']);
        assert.deepEqual(['promise', 'once'], reports);
    });
});
