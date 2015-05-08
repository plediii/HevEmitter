/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter once', function () {

    describe(' synchronous ', function () {

        it('should emit and recieve one level events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
            });
            h.emit(['storage']);
            h.emit(['storage']);
            assert.equal(1, emitted);
        });

        it('should not be able to trigger twice', function () {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
                assert(!h.emit(['storage']));
                assert.equal(1, emitted);
            });
            assert(emit(['storage']));
            assert.equal(1, emitted);
            assert(!h.emit(['storage']));
            assert.equal(1, emitted);
        });

        it('should not be able to trigger twice when registered on **', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
                assert(!h.emit(['storage']));
                assert(!called);
                assert.equal(1, emitted);
            });
            assert(h.emit(['storage']));
            assert.equal(1, emitted);
            assert(!h.emit(['storage']));
            assert.equal(1, emitted);
        });


        it('should emit and recieve two level events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['request', 'date'], function () {
                emitted += 1;
            });
            h.emit(['request', 'date']);
            h.emit(['request', 'date']);
            assert.equal(1, emitted);
        });

        it('should NOT recieve the wrong event', function () {
            var h = new H();
            var emitted = 0;
            h.once(['prismo'], function () {
                emitted += 1;
            });
            h.emit(['wish']);
            h.emit(['wish']);
            assert.equal(0, emitted);
        });

        it('should NOT receive the wrong two level event', function () {
            var h = new H();
            var emitted = 0;
            h.once(['ritz', 'cracker'], function () {
                emitted += 1;
            });
            h.emit(['cheese', 'cracker']);
            h.emit(['cheese', 'cracker']);
            assert.equal(0, emitted);
        });

        it('should trigger listeners on one star events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['bones', '*'], function () {
                emitted += 1;
            });
            h.emit(['bones', 'elephant']);
            h.emit(['bones', 'elephant']);
            assert.equal(1, emitted);
        });

        it('should trigger listeners on one star events in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['*', 'bill'], function () {
                emitted += 1;
            });
            h.emit(['thankyou', 'bill']);
            h.emit(['thankyou', 'bill']);
            assert.equal(1, emitted);
        });

        it('should trigger one star events in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function () {
                emitted += 1;
            });
            h.emit(['*', 'booster']);
            h.emit(['*', 'booster']);
            assert.equal(1, emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function () {
                emitted += 1;
            });
            h.emit(['*']);
            h.emit(['*']);
            assert.equal(0, emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['*'], function () {
                emitted += 1;
            });
            h.emit(['green', 'buns']);
            h.emit(['green', 'buns']);
            assert.equal(0, emitted);
        });

        it('should trigger two star events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['giant']);
            h.emit(['giant']);
            assert.equal(1, emitted);
        });


        it('should trigger two star emitted events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['sun'], function () {
                emitted += 1;
            });
            h.emit(['**']);
            h.emit(['**']);
            assert.equal(1, emitted);
        });

        it('should trigger two star events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['oglethorpe', 'piggy']);
            h.emit(['oglethorpe', 'piggy']);
            assert.equal(1, emitted);
        });


        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['emry', 'please'], function () {
                emitted += 1;
            });
            h.emit(['emry', '**']);
            h.emit(['emry', '**'])
            assert.equal(1, emitted);
        });

        it('should trigger second level two star events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['vanted', 'vatch']);
            h.emit(['vanted', 'vatch']);
            assert.equal(1, emitted);
        });


        it('should trigger second level two star emitted events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['trail'], function () {
                emitted += 1;
            });
            h.emit(['trail', '**']);
            h.emit(['trail', '**']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['rrr', '**'], function () {
                emitted += 1;
            });
            h.emit(['rrr', 'mooninite']);
            h.emit(['rrr', 'mooninite']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['hypersleep', 'dreams'], function () {
                emitted += 1;
            });
            h.emit(['hypersleep', '**']);
            h.emit(['hypersleep', '**']);
            assert.equal(1, emitted);
        });
    });

    describe(' promise ', function () {

        it('should emit and recieve one level events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
            });
            h.emit(['storage']);
            h.emit(['storage']);
            assert.equal(1, emitted);
        });

        it('should not be able to trigger twice', function () {
            var h = new H();
            var emitted = 0;
            h.once(['storage'], function () {
                emitted += 1;
                h.emit(['storage']);
            });
            h.emit(['storage']);
            h.emit(['storage']);
            assert.equal(1, emitted);
        });

        it('should emit and recieve two level events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['request', 'date'], function () {
                emitted += 1;
            });
            h.emit(['request', 'date']);
            h.emit(['request', 'date']);
        });

        it('should NOT recieve the wrong event', function () {
            var h = new H();
            var emitted = 0;
            h.once(['prismo'], function () {
                emitted += 1;
            });
            h.emit(['wish']);
            h.emit(['wish']);
            assert.equal(0, emitted);
        });

        it('should NOT receive the wrong two level event', function () {
            var h = new H();
            var emitted = 0;
            h.once(['ritz', 'cracker'], function () {
                emitted += 1;
            });
            h.emit(['cheese', 'cracker']);
            h.emit(['cheese', 'cracker']);
            assert.equal(0, emitted);
        });

        it('should trigger listeners on one star events', function () {
            var h = new H();
            var emitted = 0;
            h.once(['bones', '*'], function () {
                emitted += 1;
            });
            h.emit(['bones', 'elephant']);
            h.emit(['bones', 'elephant']);
            assert.equal(1, emitted);
        });

        it('should trigger listeners on one star events in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['*', 'bill'], function () {
                emitted += 1;
            });
            h.emit(['thankyou', 'bill']);
            h.emit(['thankyou', 'bill']);
            assert.equal(1, emitted);
        });

        it('should trigger one star events in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function () {
                emitted += 1;
            });
            h.emit(['*', 'booster']);
            h.emit(['*', 'booster']);
            assert.equal(1, emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['baby', 'booster'], function (msg, cb) {
                emitted += 1;
            });
            h.emit(['*']);
            h.emit(['*']);
            assert.equal(0, emitted);
        });

        it('should NOT trigger one star events only in the first place', function () {
            var h = new H();
            var emitted = 0;
            h.once(['*'], function () {
                emitted += 1;
            });
            h.emit(['green', 'buns']);
            h.emit(['green', 'buns']);
            assert.equal(0, emitted);
        });

        it('should trigger two star events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['giant'])(done);
            h.emit(['giant']);
            assert.equal(1, emitted);
        });


        it('should trigger two star emitted events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['sun'], function (msg, cb) {
                emitted += 1;
            });
            h.emit(['**']);
            h.emit(['**']);
            assert.equal(1, emitted);
        });

        it('should trigger two star events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['oglethorpe', 'piggy']);
            h.emit(['oglethorpe', 'piggy']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['emry', 'please'], function () {
                emitted += 1;
            });
            h.emit(['emry', '**']);
            h.emit(['emry', '**']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['**'], function () {
                emitted += 1;
            });
            h.emit(['vanted', 'vatch']);
            h.emit(['vanted', 'vatch']);
            assert.equal(1, emitted);
        });


        it('should trigger second level two star emitted events in the first place with one level', function () {
            var h = new H();
            var emitted = 0;
            h.once(['trail'], function () {
                emitted += 1;
            });
            h.emit(['trail', '**']);
            h.emit(['trail', '**']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['rrr', '**'], function () {
                emitted += 1;
            });
            h.emit(['rrr', 'mooninite']);
            h.emit(['rrr', 'mooninite']);
            assert.equal(1, emitted);
        });

        it('should trigger second level two star emitted events in the first place with two levels', function () {
            var h = new H();
            var emitted = 0;
            h.once(['hypersleep', 'dreams'], function () {
                emitted += 1;
            });
            h.emit(['hypersleep', '**']);
            h.emit(['hypersleep', '**']);
            assert.equal(1, emitted);
        });
    });

});
