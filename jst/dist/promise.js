"use strict";
exports.__esModule = true;
var states = { pending: 0, settled: 1, fulfilled: 2, rejected: 3 };
var asyncQueue = [];
var asyncTimer;
function asyncFlush() {
    // run promise callbacks
    for (var i = 0; i < asyncQueue.length; i++) {
        asyncQueue[i][0](asyncQueue[i][1]);
    }
    // reset async asyncQueue
    asyncQueue = [];
    asyncTimer = false;
}
function asyncCall(callback, arg) {
    asyncQueue.push([callback, arg]);
    if (!asyncTimer) {
        asyncTimer = true;
        setTimeout(asyncFlush, 0);
    }
}
function publish(promise) {
    promise._then = promise._then.forEach(invokeCallback);
}
function invokeCallback(subscriber) {
    var owner = subscriber.owner;
    var settled = owner._state;
    var value = owner._data;
    var callback = settled == states.fulfilled ? subscriber.fulfilled : subscriber.rejected;
    var promise = subscriber.then;
    if (typeof callback === 'function') {
        settled = states.fulfilled;
        try {
            value = callback(value);
        }
        catch (e) {
            reject(promise, e);
        }
    }
    else {
        throw new Error((settled == states.fulfilled ? "Resolve" : "Reject") + ' not implemented');
    }
    if (!handleThenable(promise, value)) {
        if (settled === states.fulfilled) {
            resolve(promise, value);
        }
        if (settled === states.rejected) {
            reject(promise, value);
        }
    }
}
function invokeResolver(resolver, promise) {
    function resolvePromise(value) {
        resolve(promise, value);
    }
    function rejectPromise(reason) {
        reject(promise, reason);
    }
    try {
        resolver(resolvePromise, rejectPromise);
    }
    catch (e) {
        rejectPromise(e);
    }
}
function resolve(promise, value) {
    if (promise === value || !handleThenable(promise, value)) {
        fulfill(promise, value);
    }
}
function fulfill(promise, value) {
    if (promise._state === states.pending) {
        promise._state = states.settled;
        promise._data = value;
        asyncCall(publishFulfillment, promise);
    }
}
function reject(promise, reason) {
    if (promise._state === states.pending) {
        promise._state = states.settled;
        promise._data = reason;
        asyncCall(publishRejection, promise);
    }
}
function publishFulfillment(promise) {
    promise._state = states.fulfilled;
    publish(promise);
}
function publishRejection(promise) {
    promise._state = states.rejected;
    publish(promise);
}
function handleThenable(promise, value) {
    var resolved = false;
    try {
        if (promise === value) {
            throw new TypeError('A promises callback cannot return that same promise.');
        }
        if (value && (typeof value === 'function' || typeof value === 'object')) {
            // then should be retrieved only once
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, function (val) {
                    if (!resolved) {
                        resolved = true;
                        (value === val) ? fulfill(promise, val) : resolve(promise, val);
                    }
                }, function (reason) {
                    if (!resolved) {
                        resolved = true;
                        reject(promise, reason);
                    }
                });
                return true;
            }
        }
    }
    catch (e) {
        if (!resolved) {
            reject(promise, e);
        }
        return true;
    }
    return false;
}
var Promise = /** @class */ (function () {
    function Promise(resolver) {
        this._state = states.pending;
        this._data = undefined;
        this._handled = false;
        this._then = [];
        invokeResolver(resolver, this);
    }
    Promise.prototype.then = function (onfulfilled, onrejected) {
        var subscriber = {
            owner: this,
            then: new Promise(function () { }),
            fulfilled: onfulfilled,
            rejected: onrejected
        };
        if ((onrejected || onfulfilled) && !this._handled)
            this._handled = true;
        if (this._state === states.fulfilled || this._state === states.rejected)
            // already resolved, call callback async
            asyncCall(invokeCallback, subscriber);
        else
            // subscribe
            this._then.push(subscriber);
        return subscriber.then;
    };
    Promise.prototype["catch"] = function (onrejected) {
        return this.then(null, onrejected);
    };
    Promise.all = function (promises) {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to Promise.all().');
        }
        return new Promise(function (resolve, reject) {
            var results = [];
            var remaining = 0;
            function resolver(index) {
                remaining++;
                return function (value) {
                    results[index] = value;
                    if (!--remaining) {
                        resolve(results);
                    }
                };
            }
            for (var i = 0, promise; i < promises.length; i++) {
                promise = promises[i];
                if (promise && typeof promise.then === 'function') {
                    promise.then(resolver(i), reject);
                }
                else {
                    results[i] = promise;
                }
            }
            if (!remaining) {
                resolve(results);
            }
        });
    };
    ;
    Promise.race = function (promises) {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to Promise.race().');
        }
        return new Promise(function (resolve, reject) {
            for (var i = 0, promise; i < promises.length; i++) {
                promise = promises[i];
                if (promise && typeof promise.then === 'function') {
                    promise.then(resolve, reject);
                }
                else {
                    resolve(promise);
                }
            }
        });
    };
    ;
    return Promise;
}());
exports.Promise = Promise;
