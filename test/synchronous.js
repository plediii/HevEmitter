/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
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
        h.on(['come', '**'], function () {
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

    it('should trigger sequential synchronous "name" events synchronously', function () {
        var h = new H();
        var called = 0;
        h.on(['laforge'], function () {
            called++; 
        });
        h.on(['laforge'], function () {
            called++;
        });
        h.emit(['laforge']);
        assert.equal(2, called);
    });


    it('should trigger sequential synchronous "*" events synchronously', function () {
        var h = new H();
        var called = 0;
        h.on(['*'], function () {
            called++; 
        });
        h.on(['*'], function () {
            called++;
        });
        h.emit(['beaucopu']);
        assert.equal(2, called);
    });

    it('should trigger sequential synchronous "**" events synchronously', function () {
        var h = new H();
        var called = 0;
        h.on(['**'], function () {
            called++; 
        });
        h.on(['**'], function () {
            called++;
        });
        h.emit(['longer']);
        assert.equal(2, called);
    });

    it('should trigger second level "*" events after first level "**" events synchronously', function () {
        var h = new H();
        var called = 0;
        h.on(['darthon', '*'], function () {
            called++; 
        });
        h.on(['**'], function () {
            called++;
        });
        h.emit(['darthon', 'realm']);
        assert.equal(2, called);
    });

    it('should "name" events followed by "*" events synchrnously when emitting "**" events', function () {
        var h = new H();
        var called = 0;
        h.on(['allies'], function () {
            called++; 
        });
        h.on(['*'], function () {
            called++;
        });
        h.emit(['**']);
        assert.equal(2, called);
    });



});
