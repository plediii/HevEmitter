/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter on', function () {

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

        it('should report called even when callback is deferred', function (done) {
            var h = new H();
            h.on(['flip'], function (msg, cb) {
                process.nextTick(cb);
            });
            h.emit(['flip'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        describe('two star', function () {

            describe('on first level', function () {
                it('should short circuit named event on first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });



                it('should short circuit named event on first level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the first level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

            });

            describe('on second level', function () {

                it('should short circuit named event on second level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['togg', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['togg', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['togg', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the second level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['togg', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['togg', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['togg', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['daemon', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['daemon', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['daemon', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['daemon', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['daemon', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['daemon', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });






                it('should short circuit named event on second level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['togg', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['togg', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['togg', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the second level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['togg', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['togg', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['togg', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['daemon', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['daemon', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['daemon', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['daemon', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['daemon', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['daemon', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

            });

        });

        describe('one star', function () {

            describe('on first level', function () {

                it('should short circuit named event on first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['stay'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['stay'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['stay'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['stay'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on first level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['stay'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['*'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['stay'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the first level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['stay'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['*'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['stay'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['stay']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['*'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['once']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

            });

            describe('on second level', function () {

                it('should short circuit named event on second level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the second level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['troy', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['troy', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['shields', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['shields', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.emit(['shields', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });


                it('should short circuit named event on second level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['troy', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the second level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.on(['troy', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('error should short circuit one star on the first level (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['troy', '**'], function (msg, cb) {
                        return cb('block');
                    });
                    h.emit(['troy', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

                it('error should short circuit one star on the first level even if deferred (reverse order)', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['shields', '*'], function (msg, cb) {
                        blocked = false;
                    });
                    h.on(['shields', '**'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.emit(['shields', 'gross']).then(function() {
                        blocked = false;
                    })
                        .catch(function (err) { 
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done(); 
                        });
                });

            });

        });

        describe('named event', function () {

            describe('on first level', function () {
                it('should short circuit named event on first level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['luc'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['luc'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['luc'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the first level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['luc'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['luc'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['luc'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

            });

            describe('on second level', function () {

                it('should short circuit named event on second level', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', 'gross'], function (msg, cb) {
                        return cb('block');
                    });
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });

                it('should short circuit named event on the second level even if deferred', function (done) {
                    var h = new H();
                    var blocked = true;
                    h.on(['troy', 'gross'], function (msg, cb) {
                        process.nextTick(function () {
                            return cb('block');
                        });
                    });
                    h.on(['troy', 'gross'], function (msg, cb) {
                        blocked = false;
                        cb();
                    });
                    h.emit(['troy', 'gross'])
                        .catch(function (err) {
                            assert.equal(err.message, 'block');
                            assert(blocked);
                            done();
                        });
                });
            });

        });
        
    });

});
