/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter on synchronous listener ', function () {

    it('should trigger synchronous ** events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['**'], function () {
            called = true;
        });
        h.emit(['ventaxi']);
        assert(called);
    });

    it('should trigger synchronous * events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['*'], function () {
            called = true;
        });
        h.emit(['bridge']);
        assert(called);
    });


    it('should trigger synchronous "name" events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['laforge'], function () {
            called = true;
        });
        h.emit(['laforge']);
        assert(called);
    });


    it('should trigger synchronous */"name" events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['*', 'worf'], function () {
            called = true;
        });
        h.emit(['data', 'worf']);
        assert(called);
    });


    it('should trigger synchronous */** events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['*', '**'], function () {
            called = true;
        });
        h.emit(['klingon', 'clansmen', 'culture']);
        assert(called);
    });


    it('should trigger synchronous */* events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['*', '*'], function () {
            called = true;
        });
        h.emit(['well', 'done']);
        assert(called);
    });


    it('should trigger synchronous */"name" events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['*', 'shuttle'], function () {
            called = true;
        });
        h.emit(['enterprise', 'shuttle']);
        assert(called);
    });


    it('should trigger synchronous "name"/** events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['come', '*'], function () {
            called = true;
        });
        h.emit(['come', 'in', 'enterprise']);
        assert(called);
    });


    it('should trigger synchronous "name"/* events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['locate', '*'], function () {
            called = true;
        });
        h.emit(['locate', '*']);
        assert(called);
    });


    it('should trigger synchronous "name"/"name" events synchronously', function () {
        var h = new H();
        var called = false;
        h.on(['jump', 'particle'], function () {
            called = true;
        });
        h.emit(['*', '*']);
        assert(called);
    });


});
