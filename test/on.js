/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('implicit promise', function () {

        it('should trigger promise success on one level mismatch', function () {
            var h = new H();
            h.on(['joke'], function () {});
            assert(!h.emit(['horse']));
        });

        it('should trigger promise success on one level match', function () {
            var h = new H();
            h.on(['son'], function () {});
            assert(h.emit(['son']));
        });

        it('should trigger promise success on two level match', function () {
            var h = new H();
            h.on(['ask', 'something'], function () {});
            assert(h.emit(['ask', 'something']));
        });

        it('should trigger promise success even on two level mismatch', function () {
            var h = new H();
            h.on(['gree', 'gaa'], function () {});
            assert(!h.emit(['gree', 'goo']));
        });

        it('should trigger promise success on second level star', function () {
            var h = new H();
            h.on(['doctor', 'who'], function () {});
            assert(h.emit(['doctor', '*']));
        });

        it('should trigger star-star after emitting first level star', function () {
            var h = new H();
            h.on(['base', '**'], function () {});
            assert(h.emit(['*', 'belong']));
        });

        it('should trigger "name"/** on "name" event', function () {
            var h = new H();
            h.on(['base', '**'], function () {});
            assert(h.emit(['base']));
        });


    });

    describe('no explicit promise', function () {

        it('should emit and recieve one level events', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['storage'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['storage'], msg));
            assert(h.emit(['storage'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should emit and recieve two level events', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['request', 'date'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['request', 'date'], msg));
            assert(h.emit(['request', 'date'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should NOT recieve the wrong event', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['prismo'], function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(['wish'], msg));
            assert.equal(0, msg.emitted);

        });

        it('should NOT receive the wrong two level event', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['ritz', 'cracker'], function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(['cheese', 'cracker'], msg));
            assert.equal(0, msg.emitted);
        });

        it('should trigger listeners on one star events', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['bones', '*'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['bones', 'elephant'], msg));
            assert(h.emit(['bones', 'elephant'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger listeners on one star events in the first place', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['*', 'bill'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['thankyou', 'bill'], msg));
            assert(h.emit(['thankyou', 'bill'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger one star events in the first place', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['baby', 'booster'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['*', 'booster'], msg));
            assert(h.emit(['*', 'booster'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['baby', 'booster'], function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(['*'], msg));
            assert.equal(0, msg.emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['*'], function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(['green', 'buns'], msg));
            assert.equal(0, msg.emitted);
        });

        it('should trigger two star events in the first place with one level', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['giant'], msg));
            assert(h.emit(['giant'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger two star emitted events in the first place with one level', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['sun'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['**'], msg));
            assert(h.emit(['**'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger two star events in the first place with two levels', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['oglethorpe', 'piggy'], msg));
            assert(h.emit(['oglethorpe', 'piggy'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['emry', 'please'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['emry', '**'], msg));
            assert(h.emit(['emry', '**'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger second level two star events in the first place with one level', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['vanted', 'vatch'], msg));
            assert(h.emit(['vanted', 'vatch'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger second level two star emitted events in the first place with one level', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['trail'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['trail', '**'], msg));
            assert(h.emit(['trail', '**'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger second level two star events in the first place with two levels', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['rrr', '**'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['rrr', 'mooninite'], msg));
            assert(h.emit(['rrr', 'mooninite'], msg));
            assert.equal(2, msg.emitted);
        });

        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['hypersleep', 'dreams'], function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(['hypersleep', '**'], msg));
            assert(h.emit(['hypersleep', '**'], msg));
            assert.equal(2, msg.emitted);
        });

    });

});
