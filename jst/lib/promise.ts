var states = {pending: 0, settled: 1, fulfilled: 2, rejected: 3}
var asyncQueue:any[] = [];
var asyncTimer:boolean;

function asyncFlush() {
	// run promise callbacks
	for (var i = 0; i < asyncQueue.length; i++) {
		asyncQueue[i][0](asyncQueue[i][1]);
	}

	// reset async asyncQueue
	asyncQueue = [];
	asyncTimer = false;
}

function asyncCall(callback:any, arg:any) {
	asyncQueue.push([callback, arg]);

	if (!asyncTimer) {
		asyncTimer = true;
		setTimeout(asyncFlush, 0);
	}
}

interface isubscribe<T> {
    owner: any,
    then: Promise<T>,
    fulfilled: ((value: T) => any) | null | undefined,
    rejected: ((reason: any) => any) | null | undefined
}

function publish(promise:any) {
    promise._then = promise._then.forEach(invokeCallback);
}

function invokeCallback<T>(subscriber:isubscribe<T>) {
    var owner = subscriber.owner;
    var settled = owner._state;
    var value = owner._data;
    var callback = settled == states.fulfilled ? subscriber.fulfilled : subscriber.rejected;
    var promise = subscriber.then;

    if (typeof callback === 'function') {
        settled = states.fulfilled;
        try {
            value = callback(value);
        } catch (e) {
            reject(promise, e);
        }
    } else {
        throw new Error((settled == states.fulfilled ? "Resolve" : "Reject") + ' not implemented' );
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

function invokeResolver<T>(resolver:any, promise:Promise<T>) {
    function resolvePromise(value:T) {
        resolve(promise, value);
    }

    function rejectPromise(reason:any) {
        reject(promise, reason);
    }

    try {
        resolver(resolvePromise, rejectPromise);
    } catch (e) {
        rejectPromise(e);
    }
}

function resolve(promise:any, value:any) {
    if (promise === value || !handleThenable(promise, value)) {
        fulfill(promise, value);
    }
}

function fulfill(promise:any, value:any) {
    if (promise._state === states.pending) {
        promise._state = states.settled;
        promise._data = value;

        asyncCall(publishFulfillment, promise);
    }
}

function reject(promise:any, reason:any) {
    if (promise._state === states.pending) {
        promise._state = states.settled;
        promise._data = reason;

        asyncCall(publishRejection, promise);
    }
}
    
function publishFulfillment(promise:any) {
    promise._state = states.fulfilled;
    publish(promise);
}

function publishRejection(promise:any) {
    promise._state = states.rejected;
    publish(promise);
}    

function handleThenable(promise:any, value:any) {
    let resolved = false;

    try {
        if (promise === value) {
            throw new TypeError('A promises callback cannot return that same promise.');
        }

        if (value && (typeof value === 'function' || typeof value === 'object')) {
            // then should be retrieved only once
            var then = value.then;

            if (typeof then === 'function') {
                then.call(value, function (val:any) {
                    if (!resolved) {
                        resolved = true;
                        (value === val) ? fulfill(promise, val) :resolve(promise, val);
                    }
                }, function (reason:any) {
                    if (!resolved) {
                        resolved = true;
                        reject(promise, reason);
                    }
                });

                return true;
            }
        }
    } catch (e) {
        if (!resolved) {
            reject(promise, e);
        }

        return true;
    }

    return false;
}

export class Promise<T> implements Promise<T> {

    _state = states.pending;
	_data = undefined;
    _handled = false;
    _then: isubscribe<T>[] = [];
    
    constructor(resolver:Function) {
        invokeResolver(resolver, this);
    }
    
    then<TResult1 = T, TResult2 = never>( onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined
                                        , onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
                                        ): Promise<T> 
    {
        var subscriber = {
			owner: this,
			then: new Promise<T>(function () {}),
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
    }    
    
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T> 
    {
        return this.then(null, onrejected);
    }    


    static all(promises:Promise<any>[]) : Promise<any> {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to Promise.all().');
        }
    
        return new Promise(function (resolve:Function, reject:any) {
            var results : any[] = [];
            var remaining = 0;
    
            function resolver(index:number) {
                remaining++;
                return function (value:any) {
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
                } else {
                    results[i] = promise;
                }
            }
    
            if (!remaining) {
                resolve(results);
            }
        });
    };
    
    static race(promises:Promise<any>[]) {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to Promise.race().');
        }
    
        return new Promise(function (resolve:any, reject:any) {
            for (var i = 0, promise; i < promises.length; i++) {
                promise = promises[i];
    
                if (promise && typeof promise.then === 'function') {
                    promise.then(resolve, reject);
                } else {
                    resolve(promise);
                }
            }
        });
    };
    
}
