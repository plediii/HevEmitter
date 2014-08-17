/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('implicit promise', function () {

        it('should trigger promise success on one level mismatch', function (done) {
            var h = new H();
            h.on(['joke'], function () {});
            h.emit(['horse'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });

        it('should trigger promise success on one level match', function (done) {
            var h = new H();
            h.on(['son'], function () {});
            h.emit(['son'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should trigger promise success on two level match', function (done) {
            var h = new H();
            h.on(['ask', 'something'], function () {});
            h.emit(['ask', 'something'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should trigger promise success even on two level mismatch', function (done) {
            var h = new H();
            h.on(['gree', 'gaa'], function () {});
            h.emit(['gree', 'goo'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });

    });

    describe('no explicit promise', function () {

        it('should emit and recieve one level events', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['storage'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['storage'], msg);
            h.emit(['storage'], msg)
                .then(function () {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should emit and recieve two level events', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['request', 'date'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['request', 'date'], msg);
            h.emit(['request', 'date'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should NOT recieve the wrong event', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['prismo'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['wish'], msg)
                .then(function (called) {
                    assert.equal(0, msg.emitted);
                    done();
                });

        });

        it('should NOT receive the wrong two level event', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['ritz', 'cracker'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['cheese', 'cracker'], msg)
                .then(function (called) {
                    assert.equal(0, msg.emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['bones', '*'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['bones', 'elephant'], msg);
            h.emit(['bones', 'elephant'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events in the first place', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['*', 'bill'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['thankyou', 'bill'], msg);
            h.emit(['thankyou', 'bill'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger one star events in the first place', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['baby', 'booster'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['*', 'booster'], msg);
            h.emit(['*', 'booster'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['baby', 'booster'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['*'], msg)
                .then(function (called) {
                    assert.equal(0, msg.emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['*'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['green', 'buns'], msg)
                .then(function (called) {
                    assert.equal(0, msg.emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with one level', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['giant'], msg);
            h.emit(['giant'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });


        it('should trigger two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['sun'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['**'], msg);
            h.emit(['**'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with two levels', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['oglethorpe', 'piggy'], msg);
            h.emit(['oglethorpe', 'piggy'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['emry', 'please'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['emry', '**'], msg);
            h.emit(['emry', '**'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with one level', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['**'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['vanted', 'vatch'], msg);
            h.emit(['vanted', 'vatch'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['trail'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['trail', '**'], msg);
            h.emit(['trail', '**'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with two levels', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['rrr', '**'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['rrr', 'mooninite'], msg);
            h.emit(['rrr', 'mooninite'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var msg = { emitted: 0 };
            h.on(['hypersleep', 'dreams'], function (msg) {
                msg.emitted += 1;
            });
            h.emit(['hypersleep', '**'], msg);
            h.emit(['hypersleep', '**'], msg)
                .then(function (called) {
                    assert.equal(2, msg.emitted);
                    done();
                });
        });

    });

    describe('explicit promise', function () {
        
        it('should wait for callback when provided', function (done) {
            var h = new H();
            var wait = true;
            h.on(['james'], function (msg, cb) {});
            h.on(['heroes'], function (msg, cb) {
                return cb();
            });
            h.emit(['james'])
                .then(function () {
                    wait = false;
                });
            h.emit(['heroes'])
                .then(function () {
                    assert(wait);
                    done();
                });
        });

        it('two star error should short circuit one level', function (done) {
            var h = new H();
            var twoStarShort = true;
            h.on(['**'], function (msg, cb) {
                return cb(true);
            });
            h.on(['gross'], function (msg, cb) {
                twoStarShort = false;
                cb();
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(function (err) {
                assert(twoStarShort);
                done();
            });
        });

        it('two star error should short circuit one star', function (done) {
            var h = new H();
            h.on(['**'], function (msg, cb) {
                return cb(true);
            });
            h.on(['*'], function (msg, cb) {
                assert(false);
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(done);
        });

        it('one star error should short circuit one level', function (done) {
            var h = new H();
            h.on(['*'], function (msg, cb) {
                return cb(true);
            });
            h.on(['gross'], function (msg, cb) {
                assert(false);
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(done);
        });

        it('one level should short circuit one level', function (done) {
            var h = new H();
            h.on(['baby'], function (msg, cb) {
                return cb(true);
            });
            h.on(['baby'], function (msg, cb) {
                assert(false);
            });
            h.emit(['baby']).then(function() {
                assert(false);
            })
            .catch(done);
        });
        
    });

});
