/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter once', function () {

    describe(' synchronous ', function () {

        it('should emit and recieve one level events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
            });
            h.emit(['storage']);
            h.emit(['storage'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should not be able to trigger twice', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
                h.emit(['storage']);
            });
            h.emit(['storage']);
            h.emit(['storage'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should emit and recieve two level events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['request', 'date'], function () {
                emitted += 1;
            });
            h.emit(['request', 'date']);
            h.emit(['request', 'date'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should NOT recieve the wrong event', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['prismo'], function () {
                emitted += 1;
            });
            h.emit(['wish']);
            h.emit(['wish'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });

        });

        it('should NOT receive the wrong two level event', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['ritz', 'cracker'], function () {
                emitted += 1;
            });
            h.emit(['cheese', 'cracker']);
            h.emit(['cheese', 'cracker'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['bones', '*'], function () {
                emitted += 1;
            });
            h.emit(['bones', 'elephant']);
            h.emit(['bones', 'elephant'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['*', 'bill'], function () {
                emitted += 1;
            });
            h.emit(['thankyou', 'bill']);
            h.emit(['thankyou', 'bill'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger one star events in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function () {
                emitted += 1;
            });
            h.emit(['*', 'booster']);
            h.emit(['*', 'booster'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function () {
                emitted += 1;
            });
            h.emit(['*']);
            h.emit(['*'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['*'], function () {
                emitted += 1;
            });
            h.emit(['green', 'buns']);
            h.emit(['green', 'buns'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['giant']);
            h.emit(['giant'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['sun'], function () {
                emitted += 1;
            });
            h.emit(['**']);
            h.emit(['**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['oglethorpe', 'piggy']);
            h.emit(['oglethorpe', 'piggy'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['emry', 'please'], function () {
                emitted += 1;
            });
            h.emit(['emry', '**']);
            h.emit(['emry', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['vanted', 'vatch']);
            h.emit(['vanted', 'vatch'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['trail'], function () {
                emitted += 1;
            });
            h.emit(['trail', '**']);
            h.emit(['trail', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['rrr', '**'], function () {
                emitted += 1;
            });
            h.emit(['rrr', 'mooninite']);
            h.emit(['rrr', 'mooninite'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['hypersleep', 'dreams'], function () {
                emitted += 1;
            });
            h.emit(['hypersleep', '**']);
            h.emit(['hypersleep', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });

        });


    });
    describe(' promise ', function () {

        it('should emit and recieve one level events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['storage']).catch(done);
            h.emit(['storage'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should not be able to trigger twice', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function (msg, cb) {
                emitted += 1;
                h.emit(['storage']);
                cb();
            });
            h.emit(['storage']).catch(done);
            h.emit(['storage'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should emit and recieve two level events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['request', 'date'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['request', 'date']).catch(done);
            h.emit(['request', 'date'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should NOT recieve the wrong event', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['prismo'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['wish']).catch(done);
            h.emit(['wish'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });

        });

        it('should NOT receive the wrong two level event', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['ritz', 'cracker'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['cheese', 'cracker']).catch(done);
            h.emit(['cheese', 'cracker'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['bones', '*'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['bones', 'elephant']).catch(done);
            h.emit(['bones', 'elephant'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger listeners on one star events in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['*', 'bill'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['thankyou', 'bill']).catch(done);
            h.emit(['thankyou', 'bill'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger one star events in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['*', 'booster']).catch(done);
            h.emit(['*', 'booster'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['*']).catch(done);
            h.emit(['*'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should NOT trigger one star events only in the first place', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['*'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['green', 'buns']).catch(done);
            h.emit(['green', 'buns'])
                .then(function () {
                    assert.equal(0, emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['giant']).catch(done);
            h.emit(['giant'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['sun'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['**']).catch(done);
            h.emit(['**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger two star events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['oglethorpe', 'piggy']).catch(done);
            h.emit(['oglethorpe', 'piggy'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['emry', 'please'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['emry', '**']).catch(done);
            h.emit(['emry', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['vanted', 'vatch']).catch(done);
            h.emit(['vanted', 'vatch'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });


        it('should trigger second level two star emitted events in the first place with one level', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['trail'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['trail', '**']).catch(done);
            h.emit(['trail', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['rrr', '**'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['rrr', 'mooninite']).catch(done);
            h.emit(['rrr', 'mooninite'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });

        it('should trigger second level two star emitted events in the first place with two levels', function (done) {
            var h = new H();
            var emitted = 0;
            h.once(['hypersleep', 'dreams'], function (msg, cb) {
                emitted += 1;
                cb();
            });
            h.emit(['hypersleep', '**']).catch(done);
            h.emit(['hypersleep', '**'])
                .then(function () {
                    assert.equal(1, emitted);
                    done();
                });
        });
    });

});
