/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "e9176e9ec4b4f8f60786";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "app";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/app.js")(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../Users/Dawid/AppData/Roaming/npm/node_modules/webpack/node_modules/process/browser.js":
/*!*************************************************!*\
  !*** (webpack)/node_modules/process/browser.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/JstContext.js":
/*!*******************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/JstContext.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var transform_1 = __webpack_require__(/*! ./transform */ "./node_modules/@appfibre/jst/dist/transform.js");
var promise_1 = __webpack_require__(/*! ./promise */ "./node_modules/@appfibre/jst/dist/promise.js");
var JstContext = /** @class */ (function () {
    function JstContext(settings) {
        this.transformAsync = transform_1.transformAsync;
        this.transformSync = transform_1.transformSync;
        this._cache = Object();
        this._transform = transform_1.transformAsync.bind(this);
        this._settings = settings;
        this.run = this.run.bind(this);
    }
    JstContext.prototype._require = function (url) {
        var _this = this;
        return new promise_1.Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true, null, null);
            xhr.onloadend = function () {
                if (xhr.status == 200) {
                    _this.run(xhr.responseText).then(function (output) {
                        _this._cache[url] = output;
                        resolve(output);
                    }, reject); //reason => reject(reason)
                }
                else
                    reject("Failed to resolve url " + url + ": HTTP " + xhr.status + " " + xhr.statusText);
            };
            xhr.send();
        });
    };
    JstContext.prototype.run = function (str) {
        var _this = this;
        var _req = this._require.bind(this);
        function require(url) {
            if (typeof url === "string")
                return _req(url);
            else
                return promise_1.Promise.all(url.map(function (u) { return _req(u); }));
        }
        ;
        return new promise_1.Promise(function (resolve, reject) {
            try {
                var response = _this._settings.supportsAsync ? eval("(async function run() {return " + str + "})")() : eval("(function run() {return " + str + "})")();
                if (response.then)
                    response.then(resolve, reject); //.then(output => {resolve(output)}, reason => reject(reason));
                else
                    resolve(response);
            }
            catch (e) {
                reject(e.stack);
            }
        });
    };
    JstContext.prototype.load = function (url, parse) {
        var _this = this;
        return new promise_1.Promise(function (resolve, reject) {
            var run = _this.run.bind(_this);
            var transform = _this._transform.bind(_this);
            try {
                var rq = new XMLHttpRequest();
                rq.open('get', url, true, null, null);
                rq.onloadend = function () {
                    if (rq.status == 200) {
                        if (parse) {
                            var contentType = rq.getResponseHeader("content-type");
                            if (!contentType || contentType.substring(0, "application/json".length) == "application/json" || contentType.substring(0, "application/jst".length) == "application/jst" || contentType.substring(0, "null;".length) == "null;")
                                transform(JSON.parse(rq.responseText), { "async": true }, function (output) { run(output).then(resolve, reject); }, reject);
                            //run(transform(JSON.parse(rq.responseText), { "async" : true})).then(resolve, reject); // .then(output => resolve(output), reason => reject(reason));
                            else {
                                try {
                                    resolve(eval(rq.responseText));
                                }
                                catch (e) {
                                    reject(new Error("Unable to parse response from: " + url + ", error: " + e.message));
                                }
                            }
                        }
                        else
                            resolve(rq.responseText);
                    }
                    else
                        reject("Could not locate " + (url));
                };
                rq.send();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return JstContext;
}());
exports.JstContext = JstContext;


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/app.js":
/*!************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/app.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var components_1 = __webpack_require__(/*! ./components */ "./node_modules/@appfibre/jst/dist/components.js");
var JstContext_1 = __webpack_require__(/*! ./JstContext */ "./node_modules/@appfibre/jst/dist/JstContext.js");
var intercept_1 = __webpack_require__(/*! ./intercept */ "./node_modules/@appfibre/jst/dist/intercept.js");
var promise_1 = __webpack_require__(/*! ./promise */ "./node_modules/@appfibre/jst/dist/promise.js");
function app(app) {
    var jstContext = new JstContext_1.JstContext({ requireAsync: true });
    var _context = { state: app.defaultState || {} };
    function _construct(jstComponent) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function (obj) {
                if (Array.isArray(obj) && obj.length === 1 && !Array.isArray(obj[0]))
                    return typeof obj[0] == "string" ? parse(obj) : obj[0];
                return obj == null || typeof obj === "string" || obj.$$typeof ? obj : parse(obj);
            };
            return class_1;
        }(jstComponent));
    }
    var _cache = Object();
    function _locate(resource, path) {
        var parts = path.split('.');
        var jst = false;
        var obj = resource;
        for (var part = 0; part < parts.length; part++)
            if (obj[parts[part]] !== undefined) {
                if (part == path.length - 1)
                    jst = obj.__jst;
                obj = obj[path[part]];
            }
            else
                obj = null;
        return obj;
    }
    function Resolve(fullpath) {
        if (_cache[fullpath])
            return _cache[fullpath];
        if (fullpath.substring(0, 1) == "~") {
            var parts = fullpath.substring(1, fullpath.length).split('#');
            //var obj = AppContext.xhr(parts[0], true);
            var obj = jstContext.load(parts[0], true);
            if (parts.length == 1)
                return obj;
            return obj.then(function (x) { return _locate(x, parts.slice(1, parts.length).join(".")); });
        }
        else {
            var path = fullpath.split('.');
            var obj_1 = app.components || Object;
            var jst_1 = false;
            var prop_1 = "default";
            for (var part = 0; part < path.length; part++) {
                if (typeof obj_1 === "function" && obj_1.name === "inject")
                    //obj = obj( Inject( app.designer ? class Component extends app.ui.Component { render(obj) { return parse(jst ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}:obj));
                    obj_1 = obj_1(components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                if (obj_1[path[part]] !== undefined) {
                    if (part == path.length - 1)
                        jst_1 = obj_1.__jst;
                    obj_1 = obj_1[path[part]];
                }
                else if (path.length == 1 && path[0].toLowerCase() == path[0])
                    obj_1 = path[part];
                else {
                    if (fullpath === "Exception")
                        return function transform(obj) { return ["pre", { "style": { "color": "red" } }, obj[1].stack ? obj[1].stack : obj[1]]; };
                    else {
                        console.error('Cannot load ' + fullpath);
                        return /** @class */ (function (_super) {
                            __extends(class_2, _super);
                            function class_2() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            class_2.prototype.render = function () { return parse(["span", { "style": { "color": "red" } }, fullpath + " not found!"]); };
                            return class_2;
                        }(app.ui.Component));
                    }
                }
            }
            if (obj_1.__esModule && obj_1["default"]) {
                jst_1 = obj_1.__jst;
                obj_1 = obj_1["default"];
            }
            else if (jst_1)
                prop_1 = path[path.length - 1];
            if (typeof obj_1 == "function" /*&& !(obj.prototype.render)*/ && obj_1.name === "inject") // function Component injection
                //obj = obj( { Component: class Component extends Component { render(obj) { return _createElement(jst && app.designer ? [require("@appfibre/jst/intercept.js").default, {"file": jst, "method": prop}, obj] : obj); }}, components: app.components, createElement: _createElement, language: "TEST" });
                obj_1 = obj_1(components_1.Inject(app, _context, Resolve, jst_1 ? /** @class */ (function (_super) {
                    __extends(Component, _super);
                    function Component() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Component.prototype.render = function (obj) { return parse(app.designer ? [intercept_1.Intercept, { "file": jst_1, "method": prop_1 }, _construct(app.ui.Component)] : obj); };
                    return Component;
                }(app.ui.Component)) : _construct(app.ui.Component), jstContext));
            return _cache[fullpath] = Array.isArray(obj_1) ? /** @class */ (function (_super) {
                __extends(Wrapper, _super);
                function Wrapper() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Wrapper.prototype.shouldComponentUpdate = function () { return true; };
                Wrapper.prototype.render = function () { if (!obj_1[1])
                    obj_1[1] = {}; if (!obj_1[1].key)
                    obj_1[1].key = 0; return parse(jst_1 && app.designer ? [intercept_1.Intercept, { "file": jst_1, "method": prop_1 }, obj_1] : obj_1); };
                return Wrapper;
            }(app.ui.Component)) : obj_1;
        }
    }
    function processElement(ar, supportAsync, light) {
        var done = false;
        while (!done) {
            if (typeof ar[0] === "function")
                switch (ar[0].name) {
                    case "inject":
                        ar[0] = ar[0](components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
                        break;
                    case "transform":
                        return parse(ar[0](ar), undefined, supportAsync);
                    default:
                        done = true;
                }
            else if (typeof ar[0] === "string") {
                var tag = ar[0];
                ar[0] = Resolve(ar[0]);
                done = ar[0] === tag;
                if (ar[0].then && supportAsync && !light)
                    return new promise_1.Promise(function (resolve) { return ar[0].then(function (x) { return resolve(parse(x, ar[1].key, supportAsync)); }); });
            }
            else if (ar[0] && ar[0].then && !supportAsync && !light)
                return app.ui.processElement(Async, { "value": ar });
            else
                done = true;
        }
        return light ? ar : app.ui.processElement.apply(Object(), ar);
    }
    function parse(obj, key, supportAsync) {
        if (Array.isArray(obj)) {
            if (key && !obj[1])
                obj[1] = { key: key };
            if (key && !obj[1].key)
                obj[1].key = key;
        }
        else
            obj = [obj, key ? { key: key } : null];
        var isAsync = false;
        for (var idx = 0; idx < obj.length; idx++)
            if (Array.isArray(obj[idx])) {
                for (var i = 0; i < obj[idx].length; i++) {
                    if (Array.isArray(obj[idx][i]) || typeof obj[idx][i] === "function" || typeof obj[idx][i] === "object") {
                        if (typeof obj[idx][i] === "function" || Array.isArray(obj[idx][i]))
                            obj[idx][i] = (idx == 2) ? parse(obj[idx][i], undefined, supportAsync) : processElement(obj[idx][i], supportAsync, true);
                        if (obj[idx][i].then)
                            isAsync = true;
                    }
                    else if (idx == 2)
                        throw new Error("Expected either double array or string for children Parent:" + String(obj[0]) + ", Child:" + JSON.stringify(obj[idx][i], function (key, value) { return typeof value === "function" ? String(value) : value; }));
                }
            }
        //if (isAsync && !obj[idx].then) obj[idx] = new Promise((resolve,reject) => Promise.all(obj[idx]).then(output => resolve(output), reason => reject(reason)));
        if (isAsync)
            for (var idx = 0; idx < obj.length; idx++)
                if (!obj[idx].then)
                    obj[idx] = promise_1.Promise.all(obj[idx]);
        if (!isAsync && ((typeof obj[0] === "function" && obj[0].then) || (typeof obj[1] === "function" && obj[1].then)))
            isAsync = true;
        if (!isAsync) {
            obj = processElement(obj, supportAsync);
            if (typeof obj === 'function' && obj.then && !supportAsync)
                return processElement([Async, { value: obj }], supportAsync);
            else
                return obj;
        }
        if (!supportAsync && isAsync)
            return processElement([Async, { value: promise_1.Promise.all(obj).then(function (o) { return processElement(o, supportAsync); }) }]);
        return isAsync ? new promise_1.Promise(function (resolve) { return promise_1.Promise.all(obj).then(function (o) { return resolve(processElement(o, supportAsync)); }); }) : processElement([obj[0], obj[1], obj[2]], supportAsync);
    }
    var App = /** @class */ (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = _super.call(this) || this;
            _context.setState = _this.setAppState.bind(_this);
            return _this;
        }
        App.prototype.componentWillMount = function () {
            var _this = this;
            this.setState(_context.state, function () {
                if (app.stateChanged)
                    app.stateChanged.call(_this);
            });
        };
        App.prototype.setAppState = function (props, callback) {
            var _this = this;
            if (props != null) {
                var keys = Object.keys(props);
                for (var i in keys)
                    Object.defineProperty(_context.state, keys[i], Object.getOwnPropertyDescriptor(props, keys[i]) || {});
            }
            this.setState(props, function () {
                if (app.stateChanged)
                    app.stateChanged.call(_this);
                if (callback)
                    callback();
            });
        };
        App.prototype.render = function () {
            return _super.prototype.render.call(this, this.props.children);
        };
        return App;
    }(_construct(app.ui.Component)));
    var Async = /** @class */ (function (_super) {
        __extends(Async, _super);
        function Async(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                value: _this.props.value[3]
            };
            return _this;
        }
        Async.prototype.componentDidMount = function () {
            var _this = this;
            if (promise_1.Promise.prototype.isPrototypeOf(this.props.value))
                this.props.value.then(function (value) { return _this.setState({ "value": value }); }, function (err) { return _this.setState({ "value": _this.props.value[4] ? _this.props.value[4](err) : ["Exception", err] }); });
            else if (this.props.value[0] && this.props.value[0].then)
                this.props.value[0].then(function (value) { return _this.setState({ "value": value }); }, function (err) { return _this.setState({ "value": _this.props.value[4] ? _this.props.value[4](err) : ["Exception", err] }); });
            else
                promise_1.Promise.all(this.props.value).then(function (value) { return _this.setState({ "value": value }); })["catch"](function (err) { if (_this.props.value[4])
                    _this.setState({ "value": _this.props.value[4] }); });
        };
        Async.prototype.render = function () {
            return this.state.value && typeof this.state.value !== "string" ? _super.prototype.render.call(this, this.state.value) : "";
        };
        return Async;
    }(_construct(app.ui.Component)));
    var ui = app.app;
    if (app.designer)
        ui = [(window.parent === null || window === window.parent) ? app.designer : intercept_1.Intercept, app ? { file: app.app ? 'todo' /*app.app.__jst*/ : null } : {}, ui];
    if (typeof ui === "function" && !ui.prototype.render)
        ui = ui(components_1.Inject(app, _context, Resolve, _construct(app.ui.Component), jstContext));
    var mapRecursive = function (obj) { return Array.isArray(obj) ? obj.map(function (t) { return mapRecursive(t); }) : obj; };
    if (Array.isArray(ui))
        ui = mapRecursive(ui);
    function onParsed(ui) {
        document.addEventListener("DOMContentLoaded", function (event) {
            var target = app.target || document.body;
            if (target === document.body) {
                target = document.getElementById("main") || document.body.appendChild(document.createElement("div"));
                if (!target.id)
                    target.setAttribute("id", "main");
            }
            else if (typeof target === "string")
                target = document.getElementById(target);
            if (target == null)
                throw new Error("Cannot locate target (" + (target ? 'not specified' : target) + ") in html document body.");
            if (app.title)
                document.title = app.title;
            //if (module && module.hot) module.hot.accept();
            if (target.hasChildNodes())
                target.innerHTML = "";
            app.ui.render(processElement([App, _context, ui]), target);
        });
    }
    (app.async) ? parse(ui, undefined, true).then(onParsed) : onParsed(parse(ui));
}
exports.app = app;


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/components.js":
/*!*******************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/components.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var transform_1 = __webpack_require__(/*! ./transform */ "./node_modules/@appfibre/jst/dist/transform.js");
var promise_1 = __webpack_require__(/*! ./promise */ "./node_modules/@appfibre/jst/dist/promise.js");
function Inject(app, Context, Resolve, Proxy, JstContext) {
    var Component = Proxy || app.ui.Component;
    var Loader = /** @class */ (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.load = function () {
            var _this = this;
            JstContext.load(this.state.url, true).then(function (obj) { _this.setState({ children: obj }); }, function (err) { _this.setState({ children: ["Exception", err] }); });
        };
        Loader.prototype.componentWillMount = function () {
            this.componentWillUpdate({}, this.props);
        };
        Loader.prototype.componentWillUpdate = function (props, nextprops) {
            this.checkurl(nextprops);
        };
        Loader.prototype.shouldComponentUpdate = function (props) {
            return this.checkurl(props);
        };
        Loader.prototype.checkurl = function (props) {
            var url = typeof props.url === "function" ? props.url() : props.url;
            if (!this.state || this.state.url !== url)
                this.setState({ children: this.props.children, url: url }, this.load);
            return !this.state || this.state.url === url;
        };
        Loader.prototype.render = function () {
            return _super.prototype.render.call(this, this.checkurl(this.props) && this.state.children && this.state.children.length > 0 ? this.state.children : this.props.children);
        };
        return Loader;
    }(Component));
    /*let { title, designer, ui, target, ...inject } = app;
    return { Component
        , Context
        , Loader
        , components : app.components
        , ...inject
    };*/
    var inj = {
        Component: Component,
        Context: Context,
        Loader: Loader,
        Resolve: Resolve,
        State: Context.state,
        components: app.components
    };
    var keys = Object.keys(app);
    for (var i in keys)
        if (keys[i] != "title" && keys[i] != "designer" && keys[i] != "ui" && keys[i] != "target")
            Object.defineProperty(inj, keys[i], Object.getOwnPropertyDescriptor(app, keys[i]) || {});
    return inj;
}
exports.Inject = Inject;
function xhr(url, parse) {
    function parseContent(rq, resolve, reject) {
        var contentType = rq.getResponseHeader("content-type");
        if (contentType && (contentType.substr(0, "application/json".length) == "application/json" || contentType.substr(0, "null;".length) == "null;")) {
            //var output = require('@appfibre/jst').transform(JSON.parse(rq.responseText));
            transform_1.transformAsync(JSON.parse(rq.responseText), {}, function (output) { resolve(eval("[" + output + "]")[0]); }, reject);
        }
        return resolve(eval(rq.responseText));
    }
    return new promise_1.Promise(function (resolve, reject) {
        try {
            var rq = new XMLHttpRequest();
            rq.open('get', url, true, null, null);
            rq.onloadend = function () {
                if (rq.status == 200) {
                    try {
                        if (parse)
                            resolve(rq.responseText);
                        else
                            parseContent(rq, resolve, reject);
                    }
                    catch (e) {
                        reject(new Error("Unable to parse response from: " + url + ", error: " + e.message));
                    }
                }
                else
                    reject(rq.responseText);
            };
            rq.send();
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.xhr = xhr;


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var transform_1 = __webpack_require__(/*! ./transform */ "./node_modules/@appfibre/jst/dist/transform.js");
exports.transformSync = transform_1.transformSync;
exports.transformAsync = transform_1.transformAsync;
var JstContext_1 = __webpack_require__(/*! ./JstContext */ "./node_modules/@appfibre/jst/dist/JstContext.js");
exports.Context = JstContext_1.JstContext;
var app_1 = __webpack_require__(/*! ./app */ "./node_modules/@appfibre/jst/dist/app.js");
exports.app = app_1.app;


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/intercept.js":
/*!******************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/intercept.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Intercept = function inject(_a) {
    var Component = _a.Component;
    return /** @class */ (function (_super) {
        __extends(Intercept, _super);
        function Intercept() {
            var _this = _super.call(this) || this;
            _this.state = { focus: false, selected: false, editMode: null, canEdit: true };
            _this.onMessage = _this.onMessage.bind(_this);
            _this.click = _this.click.bind(_this);
            _this.mouseEnter = _this.mouseEnter.bind(_this);
            _this.mouseLeave = _this.mouseLeave.bind(_this);
            return _this;
        }
        Intercept.prototype.componentDidMount = function () {
            window.addEventListener("message", this.onMessage);
            window.onclick = function () { parent.postMessage({ eventType: "select", correlationId: Date.now().toString() }, location.href); };
        };
        Intercept.prototype.componentWillUnmount = function () {
            window.removeEventListener("message", this.onMessage);
        };
        Intercept.prototype.reconstruct = function (obj) {
            if (!obj[1])
                obj[1] = {};
            if (!obj[1].style)
                obj[1].style = {};
            if (!obj[1].style.border && !obj[1].style.padding && !obj[1].onMouseEnter && !obj[1].onMouseLeave) {
                obj[1].style.padding = this.state.focus || this.state.selected ? "1px" : "2px";
                if (this.state.editMode)
                    obj[1].style.background = "lightblue";
                if (this.state.selected)
                    obj[1].style.border = "1px solid black";
                else if (this.state.focus)
                    obj[1].style.border = "1px dashed grey";
                obj[1].onMouseEnter = this.mouseEnter;
                obj[1].onMouseLeave = this.mouseLeave;
                obj[1].onClick = this.click;
            }
            return obj;
        };
        Intercept.prototype.render = function () {
            //return super.render(Array.isArray(this.props.children) ? this.reconstruct(["div", {style: {display: "inline-block"}}, this.props.children])  : this.reconstruct(this.props.children));
            return _super.prototype.render.call(this, this.reconstruct(["div", { style: { display: "inline-block" }, key: 0 }, this.props.children]));
        };
        Intercept.prototype.mouseEnter = function () {
            //x.Designer.notify("x");
            this.setState({ "focus": true });
        };
        Intercept.prototype.mouseLeave = function () {
            //x.Designer.notify("y");
            this.setState({ "focus": false });
        };
        Intercept.prototype.click = function (ev) {
            ev.stopPropagation();
            //Designer.notify(this.props.file);
            var parent = window;
            while (parent.parent !== parent && window.parent != null)
                parent = parent.parent;
            var correlationId = Date.now().toString();
            parent.postMessage({ eventType: "select", editMode: this.state.editMode, canEdit: this.state.canEdit, correlationId: correlationId, control: { file: this.props.file, method: this.props.method } }, location.href);
            this.setState({ "selected": correlationId });
        };
        Intercept.prototype.onMessage = function (ev) {
            if (location.href.substr(0, ev.origin.length) == ev.origin && ev.type == "message" && ev.data) {
                if (this.state.selected == ev.data.correlationId)
                    switch (ev.data.eventType) {
                        case "deselect":
                            this.setState({ selected: false });
                            break;
                        case "edit":
                            this.setState({ editMode: ev.data.editMode });
                            break;
                    }
            }
        };
        return Intercept;
    }(Component));
};
exports.Intercept = Intercept;


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/promise.js":
/*!****************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/promise.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./node_modules/@appfibre/jst/dist/transform.js":
/*!******************************************************!*\
  !*** ./node_modules/@appfibre/jst/dist/transform.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var req = function (val, parseSettings, reqasync) {
    var expr = '';
    var keywords = ["this", "self", "window", "module", "parent", "alert", "confirm"];
    if (typeof val === "string") {
        var uri = val.split('#');
        var async = uri[0].length > 1 && uri[0].charAt(0) == '~';
        if (async)
            uri[0] = uri[0].substring(1);
        for (var index = 0; index < uri.length; index++) {
            if (index == 0)
                expr = keywords.indexOf(uri[index]) > -1 ? uri[index] : async ? "obj" : "(" + (reqasync ? 'await ' : '') + "require(\"" + uri[index] + "\"))";
            else
                expr = expr + "." + uri[index];
        }
        if (async)
            expr = "import(" + ('.' + uri[0]) + ").then(function(obj){return " + expr + "})";
    }
    else
        console.error("todo req " + val);
    return expr;
};
var imp = function (val, parseSettings) {
    var expr = '';
    var uri = val.split('#');
    var async = uri[0].length > 1 && uri[0].charAt(0) == '~';
    if (async)
        uri[0] = uri[0].substring(1);
    for (var index = 0; index < uri.length; index++) {
        if (index == 0) {
            if (parseSettings.imports.indexOf(uri[index]) == -1)
                parseSettings.imports.push(uri[index]);
            expr = "imports[" + parseSettings.imports.indexOf(uri[index]) + "]";
        }
        else
            expr = expr + "." + uri[index];
    }
    return expr;
};
function process(obj, esc, et, parseSettings, offset) {
    if (obj === null)
        return "null";
    if (Array.isArray(obj)) {
        var inner = false;
        obj.forEach(function (x) { return inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)); });
        return (et ? "" : "[") + obj.map(function (e, i) { return (parseSettings && parseSettings.indent ? " " : "") + process(e, esc, false, parseSettings, (offset || 0) + 2) + ((i < obj.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') : "")); }).join(",") + (et ? "" : "]");
    }
    else if (typeof obj === "object") {
        var keys = Object.keys(obj);
        for (var k in keys)
            if (keys[k].length > 0 && keys[k].charAt(0) == '.') {
                if (parseSettings.parsers[keys[k]])
                    return parseSettings.parsers[keys[k]](obj, offset) || '';
                else
                    console.error("Could not locate parser " + keys[k].substr(1));
            }
        var inner = false;
        keys.forEach(function (x) { return inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)); });
        return (et ? "" : "{") + keys.filter(function (k) { return k.length < 2 || k.substr(0, 2) != '..'; }).map(function (k, i) { return (parseSettings.indent ? " " : "") + "\"" + k + "\": " + process(obj[k], esc, false, parseSettings, offset) + ((i < keys.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') : "")); }).join(",") + (et ? "" : "}");
    }
    else if (typeof obj === "function") // object not JSON...
        return obj.toString();
    return typeof obj === "string" && esc ? JSON.stringify(obj) : obj;
}
function initializeSettings(settings) {
    var parseSettings = { parsers: {}, indent: settings.indent ? 4 : 0, imports: [] };
    parseSettings.parsers[".function"] = function (obj, offset) { return "function " + (obj[".function"] ? obj[".function"] : "") + "(" + (obj["arguments"] ? process(obj["arguments"], false, true, parseSettings, offset) : "") + "){ return " + process(obj["return"], true, false, parseSettings, offset) + " }"; };
    parseSettings.parsers[".app"] = function (obj, offset) {
        var obj2 = {};
        var keys = Object.keys(obj);
        for (var key in keys)
            obj2[keys[key] == ".app" ? "app" : keys[key]] = obj[keys[key]];
        return "require('@appfibre/jst').app( " + process(obj2, true, false, parseSettings, offset) + " )";
    };
    parseSettings.parsers[".map"] = function (obj, offset) { return process(obj[".map"], false, false, parseSettings, offset) + ".map(function(" + obj["arguments"] + ") {return " + (settings && settings.indent ? new Array(offset).join(' ') : "") + process(obj["return"], true, false, parseSettings, offset) + " })"; };
    parseSettings.parsers[".filter"] = function (obj, offset) { return process(obj[".filter"], false, false, parseSettings, offset) + ".filter(function(" + obj["arguments"] + ") {return " + process(obj["condition"], true, false, parseSettings, offset) + " })"; };
    parseSettings.parsers[".require"] = function (obj, offset) { return req(obj[".require"], parseSettings, settings && settings.async); };
    parseSettings.parsers[".import"] = function (obj, offset) { return imp(obj[".import"], parseSettings); };
    parseSettings.parsers["."] = function (obj, offset) { return obj["."]; };
    return parseSettings;
}
/*
function chain (obj:any, settings:IParseSettings, resolve:Function, reject:Function) {
    if (obj && !obj.then)
        obj = process(obj, true, false, settings, 0);

    if (Array.isArray(obj)){
        let ar : any[] = [];
        obj.reduceRight(function(prev, cur) {
            function r (v:any) { chain(v, settings, function (q:any) { ar[ar.length] = q; prev(ar); }, reject) }
            return function() { (cur && cur.then) ? cur.then(r, reject) : r(cur); }
        }, resolve)();
    } else if (obj != null && typeof obj === "object") {
        let o : {[key: string]:any} = {};
        Object.keys(obj).reduceRight(function(prev, cur) {
            function r (v:any) { chain(v, settings, function(q:any) {o[cur] = q; prev(o); }, reject)}
            return function() { (obj[cur].then) ? obj[cur].then(r, reject) : r(obj[cur]); }
        }, resolve)();
    }
    else if (obj && obj.then)
        obj.then(function (v:any) {resolve(process(v, true, false, settings, 0))}, reject);
    else
        resolve(process(obj, true, false, settings, 0));
}*/
function processAsync(obj, esc, et, parseSettings, offset, resolve, reject) {
    if (obj === null)
        resolve("null");
    if (Array.isArray(obj)) {
        var inner = false;
        obj.forEach(function (x) { return inner = (inner || Array.isArray(x) || (x !== null && typeof x === "object" && Object.keys(x).length > 0)); });
        resolve((et ? "" : "[") + obj.map(function (e, i) { return (parseSettings && parseSettings.indent ? " " : "") + process(e, esc, false, parseSettings, (offset || 0) + 2) + ((i < obj.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') : "")); }).join(",") + (et ? "" : "]"));
    }
    else if (typeof obj === "object") {
        var keys = Object.keys(obj);
        for (var k in keys)
            if (keys[k].length > 0 && keys[k].charAt(0) == '.') {
                if (parseSettings.parsers[keys[k]]) {
                    var output = parseSettings.parsers[keys[k]](obj, offset, resolve, reject);
                    if (output)
                        resolve(output);
                }
                else
                    reject("Could not locate parser " + keys[k].substr(1));
                return;
            }
        var inner = false;
        keys.forEach(function (x) { return inner = (inner || Array.isArray(obj[x]) || (obj[x] !== null && typeof obj[x] === "object" && Object.keys(obj[x]).length > 0)); });
        resolve((et ? "" : "{") + keys.filter(function (k) { return k.length < 2 || k.substr(0, 2) != '..'; }).map(function (k, i) { return (parseSettings.indent ? " " : "") + "\"" + k + "\": " + process(obj[k], esc, false, parseSettings, offset) + ((i < keys.length && parseSettings.indent && inner ? "\r\n" + new Array(offset).join(' ') : "")); }).join(",") + (et ? "" : "}"));
    }
    else if (typeof obj === "function") // object not JSON...
        return obj.toString();
    else
        return typeof obj === "string" && esc ? JSON.stringify(obj) : obj;
}
function wrapWithPromises(val, parseSettings) {
    if (parseSettings.imports.length > 0) {
        val = "require ([\"" + parseSettings.imports.join('","') + "\"]).then(function (imports) { return " + val + " }, reject)";
    }
    return val;
}
function transformSync(json, settings) {
    var parseSettings = initializeSettings(settings || {});
    return wrapWithPromises(process(json, true, false, parseSettings, 0), parseSettings);
}
exports.transformSync = transformSync;
function transformAsync(json, settings, resolve, reject) {
    var parseSettings = initializeSettings(settings || {});
    return processAsync(json, true, false, parseSettings, 0, function (output) { return resolve(wrapWithPromises(output, parseSettings)); }, reject);
}
exports.transformAsync = transformAsync;


/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var _appfibre_jst__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @appfibre/jst */ "./node_modules/@appfibre/jst/dist/index.js");
/* harmony import */ var _appfibre_jst__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_appfibre_jst__WEBPACK_IMPORTED_MODULE_0__);


var fr = new FileReader();
var context = new _appfibre_jst__WEBPACK_IMPORTED_MODULE_0__["Context"]({"async":"false"});

function transform() {
    var rows = source.value.substring(0, source.selectionStart).split('\n');
    divStatus.innerText = "Row: " + rows.length + " Col: " + rows[rows.length-1].length + " Position: " + source.selectionStart + " " + (source.selectionEnd>source.selectionStart?"Selection Length: " + source.selectionEnd-source.selectionStart + "":"");

    try {
        context.transformAsync(JSON.parse(source.value), { indent: 4}, function(result) {
            divTransform.innerText = result
            output.innerText = "No errors";
            output.style.color = "black";
                context.run(result).then(function (code) {
                    preview.innerText =  JSON.stringify(code, function(key, value) {return typeof value === "function" && value.name ? '{'+value.name+'}' : value}, 4);
                    preview.style.color = "black";
                }, function(reason) {
                    preview.innerText = reason;
                    preview.style.color = "red";
                });

            }, function(error) {
            preview.innerText = error;
            preview.style.color = "red";
        });        
    }
    catch (e) {
        preview.innerText = e;
        preview.style.color = "red";
    }
}

function formatSource(text) {
    try {
        output.innerText = "";
        output.style.color = "black";

        return process(JSON.parse(text), true, false, 0);
    }
    catch (e) {
        output.innerText = e;
        output.style.color = "red";
    }
}

function onFileLoad() {
    if (fileinput.files.length == 1) {
        fr.addEventListener('loadend', function(){source.value = fr.result});
        fr.readAsText(fileinput.files[0].slice(), "application/json");
    }    
}

function save() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'  + encodeURIComponent(source.value));
    element.setAttribute('download', fileinput.files.length == 1 ? fileinput.files[0].name : "file.json" )
    element.innerText = 'download';
    //  element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    //document.body.removeChild(element);
}

function load(url) {
    try{
        var xhr = new XMLHttpRequest();
        xhr.open('get','./default.json', true, null, null);
        xhr.onloadend = function () {
            if (xhr.status == 200) {
                try
                {
                    source.value = xhr.responseText;
                    transform();
                }
                catch (e)
                {
                    output.innerText = e;
                    output.style.color = 'red';
                }
            }
            else {
                output.innerHTML = xhr.responseText;
                output.style.color = 'red';
            }
                
        };
        xhr.send();
    } catch (e) {
        reject(e);
    }
}

document.onreadystatechange = function() {
    if (document.readyState == "complete")  {
        source.addEventListener('keyup', transform);
        btnFormat.addEventListener('click', function() {source.value = formatSource(source.value)});
        fileinput.addEventListener('input', onFileLoad);
        savefile.addEventListener('click', save);
        load('./assets/default.json');        
    }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../Users/Dawid/AppData/Roaming/npm/node_modules/webpack/node_modules/process/browser.js */ "../../../../Users/Dawid/AppData/Roaming/npm/node_modules/webpack/node_modules/process/browser.js")))

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYXBwZmlicmUvanN0L2Rpc3QvSnN0Q29udGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGFwcGZpYnJlL2pzdC9kaXN0L2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGFwcGZpYnJlL2pzdC9kaXN0L2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BhcHBmaWJyZS9qc3QvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGFwcGZpYnJlL2pzdC9kaXN0L2ludGVyY2VwdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGFwcGZpYnJlL2pzdC9kaXN0L3Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BhcHBmaWJyZS9qc3QvZGlzdC90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDZCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBa0IsOEJBQThCO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQiwyQkFBMkI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVB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QUFxQjtBQUN2SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCxnRkFBZ0YseURBQXlELEVBQUU7QUFDM0k7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RKcUI7O0FBRXJCO0FBQ0EseUVBQTJCLGdCQUFnQjs7QUFFM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMERBQTBELFdBQVc7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRkFBb0YscURBQXFELGVBQWUsVUFBVTtBQUNsSztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVMsRTtBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0RBQWtELHlCQUF5QjtBQUMzRTtBQUNBLEs7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsMENBQTBDO0FBQ2xHO0FBQ0E7QUFDQSxzQztBQUNBO0FBQ0EsQyIsImZpbGUiOiJhcHBfYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0XHRpZiAocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcbiBcdH0gO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xuIFx0XHQ7XG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7XG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XG4gXHRcdFx0fVxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxuIFx0XHRcdFx0XHRyZWplY3QoXG4gXHRcdFx0XHRcdFx0bmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKVxuIFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuIFx0XHRcdFx0XHRcdHJldHVybjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJlOTE3NmU5ZWM0YjRmOGY2MDc4NlwiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJhcHBcIjtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHQpXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZShcIi4vc3JjL2FwcC5qc1wiKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC5qc1wiKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxudmFyIHRyYW5zZm9ybV8xID0gcmVxdWlyZShcIi4vdHJhbnNmb3JtXCIpO1xyXG52YXIgcHJvbWlzZV8xID0gcmVxdWlyZShcIi4vcHJvbWlzZVwiKTtcclxudmFyIEpzdENvbnRleHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBKc3RDb250ZXh0KHNldHRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1Bc3luYyA9IHRyYW5zZm9ybV8xLnRyYW5zZm9ybUFzeW5jO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtU3luYyA9IHRyYW5zZm9ybV8xLnRyYW5zZm9ybVN5bmM7XHJcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBPYmplY3QoKTtcclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm0gPSB0cmFuc2Zvcm1fMS50cmFuc2Zvcm1Bc3luYy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgICAgdGhpcy5ydW4gPSB0aGlzLnJ1bi5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgSnN0Q29udGV4dC5wcm90b3R5cGUuX3JlcXVpcmUgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignZ2V0JywgdXJsLCB0cnVlLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgICAgeGhyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJ1bih4aHIucmVzcG9uc2VUZXh0KS50aGVuKGZ1bmN0aW9uIChvdXRwdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NhY2hlW3VybF0gPSBvdXRwdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpOyAvL3JlYXNvbiA9PiByZWplY3QocmVhc29uKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byByZXNvbHZlIHVybCBcIiArIHVybCArIFwiOiBIVFRQIFwiICsgeGhyLnN0YXR1cyArIFwiIFwiICsgeGhyLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEpzdENvbnRleHQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBfcmVxID0gdGhpcy5fcmVxdWlyZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVpcmUodXJsKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZXEodXJsKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2VfMS5Qcm9taXNlLmFsbCh1cmwubWFwKGZ1bmN0aW9uICh1KSB7IHJldHVybiBfcmVxKHUpOyB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl9zZXR0aW5ncy5zdXBwb3J0c0FzeW5jID8gZXZhbChcIihhc3luYyBmdW5jdGlvbiBydW4oKSB7cmV0dXJuIFwiICsgc3RyICsgXCJ9KVwiKSgpIDogZXZhbChcIihmdW5jdGlvbiBydW4oKSB7cmV0dXJuIFwiICsgc3RyICsgXCJ9KVwiKSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRoZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UudGhlbihyZXNvbHZlLCByZWplY3QpOyAvLy50aGVuKG91dHB1dCA9PiB7cmVzb2x2ZShvdXRwdXQpfSwgcmVhc29uID0+IHJlamVjdChyZWFzb24pKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUuc3RhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgSnN0Q29udGV4dC5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICh1cmwsIHBhcnNlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHJ1biA9IF90aGlzLnJ1bi5iaW5kKF90aGlzKTtcclxuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybSA9IF90aGlzLl90cmFuc2Zvcm0uYmluZChfdGhpcyk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIHJxLm9wZW4oJ2dldCcsIHVybCwgdHJ1ZSwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBycS5vbmxvYWRlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJxLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBycS5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29udGVudFR5cGUgfHwgY29udGVudFR5cGUuc3Vic3RyaW5nKDAsIFwiYXBwbGljYXRpb24vanNvblwiLmxlbmd0aCkgPT0gXCJhcHBsaWNhdGlvbi9qc29uXCIgfHwgY29udGVudFR5cGUuc3Vic3RyaW5nKDAsIFwiYXBwbGljYXRpb24vanN0XCIubGVuZ3RoKSA9PSBcImFwcGxpY2F0aW9uL2pzdFwiIHx8IGNvbnRlbnRUeXBlLnN1YnN0cmluZygwLCBcIm51bGw7XCIubGVuZ3RoKSA9PSBcIm51bGw7XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtKEpTT04ucGFyc2UocnEucmVzcG9uc2VUZXh0KSwgeyBcImFzeW5jXCI6IHRydWUgfSwgZnVuY3Rpb24gKG91dHB1dCkgeyBydW4ob3V0cHV0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7IH0sIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3J1bih0cmFuc2Zvcm0oSlNPTi5wYXJzZShycS5yZXNwb25zZVRleHQpLCB7IFwiYXN5bmNcIiA6IHRydWV9KSkudGhlbihyZXNvbHZlLCByZWplY3QpOyAvLyAudGhlbihvdXRwdXQgPT4gcmVzb2x2ZShvdXRwdXQpLCByZWFzb24gPT4gcmVqZWN0KHJlYXNvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShldmFsKHJxLnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiVW5hYmxlIHRvIHBhcnNlIHJlc3BvbnNlIGZyb206IFwiICsgdXJsICsgXCIsIGVycm9yOiBcIiArIGUubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJxLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiQ291bGQgbm90IGxvY2F0ZSBcIiArICh1cmwpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBycS5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBKc3RDb250ZXh0O1xyXG59KCkpO1xyXG5leHBvcnRzLkpzdENvbnRleHQgPSBKc3RDb250ZXh0O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxudmFyIGNvbXBvbmVudHNfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHNcIik7XHJcbnZhciBKc3RDb250ZXh0XzEgPSByZXF1aXJlKFwiLi9Kc3RDb250ZXh0XCIpO1xyXG52YXIgaW50ZXJjZXB0XzEgPSByZXF1aXJlKFwiLi9pbnRlcmNlcHRcIik7XHJcbnZhciBwcm9taXNlXzEgPSByZXF1aXJlKFwiLi9wcm9taXNlXCIpO1xyXG5mdW5jdGlvbiBhcHAoYXBwKSB7XHJcbiAgICB2YXIganN0Q29udGV4dCA9IG5ldyBKc3RDb250ZXh0XzEuSnN0Q29udGV4dCh7IHJlcXVpcmVBc3luYzogdHJ1ZSB9KTtcclxuICAgIHZhciBfY29udGV4dCA9IHsgc3RhdGU6IGFwcC5kZWZhdWx0U3RhdGUgfHwge30gfTtcclxuICAgIGZ1bmN0aW9uIF9jb25zdHJ1Y3QoanN0Q29tcG9uZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKGNsYXNzXzEsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsYXNzXzEoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSAmJiBvYmoubGVuZ3RoID09PSAxICYmICFBcnJheS5pc0FycmF5KG9ialswXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmpbMF0gPT0gXCJzdHJpbmdcIiA/IHBhcnNlKG9iaikgOiBvYmpbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqID09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiB8fCBvYmouJCR0eXBlb2YgPyBvYmogOiBwYXJzZShvYmopO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gY2xhc3NfMTtcclxuICAgICAgICB9KGpzdENvbXBvbmVudCkpO1xyXG4gICAgfVxyXG4gICAgdmFyIF9jYWNoZSA9IE9iamVjdCgpO1xyXG4gICAgZnVuY3Rpb24gX2xvY2F0ZShyZXNvdXJjZSwgcGF0aCkge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy4nKTtcclxuICAgICAgICB2YXIganN0ID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIG9iaiA9IHJlc291cmNlO1xyXG4gICAgICAgIGZvciAodmFyIHBhcnQgPSAwOyBwYXJ0IDwgcGFydHMubGVuZ3RoOyBwYXJ0KyspXHJcbiAgICAgICAgICAgIGlmIChvYmpbcGFydHNbcGFydF1dICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0ID09IHBhdGgubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgICAgICAgICBqc3QgPSBvYmouX19qc3Q7XHJcbiAgICAgICAgICAgICAgICBvYmogPSBvYmpbcGF0aFtwYXJ0XV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgb2JqID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gUmVzb2x2ZShmdWxscGF0aCkge1xyXG4gICAgICAgIGlmIChfY2FjaGVbZnVsbHBhdGhdKVxyXG4gICAgICAgICAgICByZXR1cm4gX2NhY2hlW2Z1bGxwYXRoXTtcclxuICAgICAgICBpZiAoZnVsbHBhdGguc3Vic3RyaW5nKDAsIDEpID09IFwiflwiKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGZ1bGxwYXRoLnN1YnN0cmluZygxLCBmdWxscGF0aC5sZW5ndGgpLnNwbGl0KCcjJyk7XHJcbiAgICAgICAgICAgIC8vdmFyIG9iaiA9IEFwcENvbnRleHQueGhyKHBhcnRzWzBdLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IGpzdENvbnRleHQubG9hZChwYXJ0c1swXSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmoudGhlbihmdW5jdGlvbiAoeCkgeyByZXR1cm4gX2xvY2F0ZSh4LCBwYXJ0cy5zbGljZSgxLCBwYXJ0cy5sZW5ndGgpLmpvaW4oXCIuXCIpKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9IGZ1bGxwYXRoLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICAgIHZhciBvYmpfMSA9IGFwcC5jb21wb25lbnRzIHx8IE9iamVjdDtcclxuICAgICAgICAgICAgdmFyIGpzdF8xID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBwcm9wXzEgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgcGFydCA9IDA7IHBhcnQgPCBwYXRoLmxlbmd0aDsgcGFydCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9ial8xID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqXzEubmFtZSA9PT0gXCJpbmplY3RcIilcclxuICAgICAgICAgICAgICAgICAgICAvL29iaiA9IG9iaiggSW5qZWN0KCBhcHAuZGVzaWduZXIgPyBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBhcHAudWkuQ29tcG9uZW50IHsgcmVuZGVyKG9iaikgeyByZXR1cm4gcGFyc2UoanN0ID8gW3JlcXVpcmUoXCJAYXBwZmlicmUvanN0L2ludGVyY2VwdC5qc1wiKS5kZWZhdWx0LCB7XCJmaWxlXCI6IGpzdCwgXCJtZXRob2RcIjogcHJvcH0sIG9ial0gOiBvYmopOyB9fTpvYmopKTtcclxuICAgICAgICAgICAgICAgICAgICBvYmpfMSA9IG9ial8xKGNvbXBvbmVudHNfMS5JbmplY3QoYXBwLCBfY29udGV4dCwgUmVzb2x2ZSwgX2NvbnN0cnVjdChhcHAudWkuQ29tcG9uZW50KSwganN0Q29udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ial8xW3BhdGhbcGFydF1dICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydCA9PSBwYXRoLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzdF8xID0gb2JqXzEuX19qc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqXzEgPSBvYmpfMVtwYXRoW3BhcnRdXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhdGgubGVuZ3RoID09IDEgJiYgcGF0aFswXS50b0xvd2VyQ2FzZSgpID09IHBhdGhbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqXzEgPSBwYXRoW3BhcnRdO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bGxwYXRoID09PSBcIkV4Y2VwdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKG9iaikgeyByZXR1cm4gW1wicHJlXCIsIHsgXCJzdHlsZVwiOiB7IFwiY29sb3JcIjogXCJyZWRcIiB9IH0sIG9ialsxXS5zdGFjayA/IG9ialsxXS5zdGFjayA6IG9ialsxXV07IH07XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBsb2FkICcgKyBmdWxscGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfX2V4dGVuZHMoY2xhc3NfMiwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsYXNzXzIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NfMi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFyc2UoW1wic3BhblwiLCB7IFwic3R5bGVcIjogeyBcImNvbG9yXCI6IFwicmVkXCIgfSB9LCBmdWxscGF0aCArIFwiIG5vdCBmb3VuZCFcIl0pOyB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzXzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0oYXBwLnVpLkNvbXBvbmVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqXzEuX19lc01vZHVsZSAmJiBvYmpfMVtcImRlZmF1bHRcIl0pIHtcclxuICAgICAgICAgICAgICAgIGpzdF8xID0gb2JqXzEuX19qc3Q7XHJcbiAgICAgICAgICAgICAgICBvYmpfMSA9IG9ial8xW1wiZGVmYXVsdFwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChqc3RfMSlcclxuICAgICAgICAgICAgICAgIHByb3BfMSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpfMSA9PSBcImZ1bmN0aW9uXCIgLyomJiAhKG9iai5wcm90b3R5cGUucmVuZGVyKSovICYmIG9ial8xLm5hbWUgPT09IFwiaW5qZWN0XCIpIC8vIGZ1bmN0aW9uIENvbXBvbmVudCBpbmplY3Rpb25cclxuICAgICAgICAgICAgICAgIC8vb2JqID0gb2JqKCB7IENvbXBvbmVudDogY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHsgcmVuZGVyKG9iaikgeyByZXR1cm4gX2NyZWF0ZUVsZW1lbnQoanN0ICYmIGFwcC5kZXNpZ25lciA/IFtyZXF1aXJlKFwiQGFwcGZpYnJlL2pzdC9pbnRlcmNlcHQuanNcIikuZGVmYXVsdCwge1wiZmlsZVwiOiBqc3QsIFwibWV0aG9kXCI6IHByb3B9LCBvYmpdIDogb2JqKTsgfX0sIGNvbXBvbmVudHM6IGFwcC5jb21wb25lbnRzLCBjcmVhdGVFbGVtZW50OiBfY3JlYXRlRWxlbWVudCwgbGFuZ3VhZ2U6IFwiVEVTVFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgb2JqXzEgPSBvYmpfMShjb21wb25lbnRzXzEuSW5qZWN0KGFwcCwgX2NvbnRleHQsIFJlc29sdmUsIGpzdF8xID8gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIF9fZXh0ZW5kcyhDb21wb25lbnQsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gQ29tcG9uZW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gcGFyc2UoYXBwLmRlc2lnbmVyID8gW2ludGVyY2VwdF8xLkludGVyY2VwdCwgeyBcImZpbGVcIjoganN0XzEsIFwibWV0aG9kXCI6IHByb3BfMSB9LCBfY29uc3RydWN0KGFwcC51aS5Db21wb25lbnQpXSA6IG9iaik7IH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudDtcclxuICAgICAgICAgICAgICAgIH0oYXBwLnVpLkNvbXBvbmVudCkpIDogX2NvbnN0cnVjdChhcHAudWkuQ29tcG9uZW50KSwganN0Q29udGV4dCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gX2NhY2hlW2Z1bGxwYXRoXSA9IEFycmF5LmlzQXJyYXkob2JqXzEpID8gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgX19leHRlbmRzKFdyYXBwZXIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBXcmFwcGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFdyYXBwZXIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH07XHJcbiAgICAgICAgICAgICAgICBXcmFwcGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7IGlmICghb2JqXzFbMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqXzFbMV0gPSB7fTsgaWYgKCFvYmpfMVsxXS5rZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqXzFbMV0ua2V5ID0gMDsgcmV0dXJuIHBhcnNlKGpzdF8xICYmIGFwcC5kZXNpZ25lciA/IFtpbnRlcmNlcHRfMS5JbnRlcmNlcHQsIHsgXCJmaWxlXCI6IGpzdF8xLCBcIm1ldGhvZFwiOiBwcm9wXzEgfSwgb2JqXzFdIDogb2JqXzEpOyB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFdyYXBwZXI7XHJcbiAgICAgICAgICAgIH0oYXBwLnVpLkNvbXBvbmVudCkpIDogb2JqXzE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0VsZW1lbnQoYXIsIHN1cHBvcnRBc3luYywgbGlnaHQpIHtcclxuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHdoaWxlICghZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyWzBdID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGFyWzBdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyWzBdID0gYXJbMF0oY29tcG9uZW50c18xLkluamVjdChhcHAsIF9jb250ZXh0LCBSZXNvbHZlLCBfY29uc3RydWN0KGFwcC51aS5Db21wb25lbnQpLCBqc3RDb250ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2Zvcm1cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlKGFyWzBdKGFyKSwgdW5kZWZpbmVkLCBzdXBwb3J0QXN5bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJbMF0gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YWcgPSBhclswXTtcclxuICAgICAgICAgICAgICAgIGFyWzBdID0gUmVzb2x2ZShhclswXSk7XHJcbiAgICAgICAgICAgICAgICBkb25lID0gYXJbMF0gPT09IHRhZztcclxuICAgICAgICAgICAgICAgIGlmIChhclswXS50aGVuICYmIHN1cHBvcnRBc3luYyAmJiAhbGlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXR1cm4gYXJbMF0udGhlbihmdW5jdGlvbiAoeCkgeyByZXR1cm4gcmVzb2x2ZShwYXJzZSh4LCBhclsxXS5rZXksIHN1cHBvcnRBc3luYykpOyB9KTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXJbMF0gJiYgYXJbMF0udGhlbiAmJiAhc3VwcG9ydEFzeW5jICYmICFsaWdodClcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcHAudWkucHJvY2Vzc0VsZW1lbnQoQXN5bmMsIHsgXCJ2YWx1ZVwiOiBhciB9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaWdodCA/IGFyIDogYXBwLnVpLnByb2Nlc3NFbGVtZW50LmFwcGx5KE9iamVjdCgpLCBhcik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwYXJzZShvYmosIGtleSwgc3VwcG9ydEFzeW5jKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICYmICFvYmpbMV0pXHJcbiAgICAgICAgICAgICAgICBvYmpbMV0gPSB7IGtleToga2V5IH07XHJcbiAgICAgICAgICAgIGlmIChrZXkgJiYgIW9ialsxXS5rZXkpXHJcbiAgICAgICAgICAgICAgICBvYmpbMV0ua2V5ID0ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9iaiA9IFtvYmosIGtleSA/IHsga2V5OiBrZXkgfSA6IG51bGxdO1xyXG4gICAgICAgIHZhciBpc0FzeW5jID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgb2JqLmxlbmd0aDsgaWR4KyspXHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtpZHhdKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpbaWR4XS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtpZHhdW2ldKSB8fCB0eXBlb2Ygb2JqW2lkeF1baV0gPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygb2JqW2lkeF1baV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpbaWR4XVtpXSA9PT0gXCJmdW5jdGlvblwiIHx8IEFycmF5LmlzQXJyYXkob2JqW2lkeF1baV0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2lkeF1baV0gPSAoaWR4ID09IDIpID8gcGFyc2Uob2JqW2lkeF1baV0sIHVuZGVmaW5lZCwgc3VwcG9ydEFzeW5jKSA6IHByb2Nlc3NFbGVtZW50KG9ialtpZHhdW2ldLCBzdXBwb3J0QXN5bmMsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqW2lkeF1baV0udGhlbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgZWl0aGVyIGRvdWJsZSBhcnJheSBvciBzdHJpbmcgZm9yIGNoaWxkcmVuIFBhcmVudDpcIiArIFN0cmluZyhvYmpbMF0pICsgXCIsIENoaWxkOlwiICsgSlNPTi5zdHJpbmdpZnkob2JqW2lkeF1baV0sIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7IHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IFN0cmluZyh2YWx1ZSkgOiB2YWx1ZTsgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLy9pZiAoaXNBc3luYyAmJiAhb2JqW2lkeF0udGhlbikgb2JqW2lkeF0gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IFByb21pc2UuYWxsKG9ialtpZHhdKS50aGVuKG91dHB1dCA9PiByZXNvbHZlKG91dHB1dCksIHJlYXNvbiA9PiByZWplY3QocmVhc29uKSkpO1xyXG4gICAgICAgIGlmIChpc0FzeW5jKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBvYmoubGVuZ3RoOyBpZHgrKylcclxuICAgICAgICAgICAgICAgIGlmICghb2JqW2lkeF0udGhlbilcclxuICAgICAgICAgICAgICAgICAgICBvYmpbaWR4XSA9IHByb21pc2VfMS5Qcm9taXNlLmFsbChvYmpbaWR4XSk7XHJcbiAgICAgICAgaWYgKCFpc0FzeW5jICYmICgodHlwZW9mIG9ialswXSA9PT0gXCJmdW5jdGlvblwiICYmIG9ialswXS50aGVuKSB8fCAodHlwZW9mIG9ialsxXSA9PT0gXCJmdW5jdGlvblwiICYmIG9ialsxXS50aGVuKSkpXHJcbiAgICAgICAgICAgIGlzQXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIGlmICghaXNBc3luYykge1xyXG4gICAgICAgICAgICBvYmogPSBwcm9jZXNzRWxlbWVudChvYmosIHN1cHBvcnRBc3luYyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai50aGVuICYmICFzdXBwb3J0QXN5bmMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc0VsZW1lbnQoW0FzeW5jLCB7IHZhbHVlOiBvYmogfV0sIHN1cHBvcnRBc3luYyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3VwcG9ydEFzeW5jICYmIGlzQXN5bmMpXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9jZXNzRWxlbWVudChbQXN5bmMsIHsgdmFsdWU6IHByb21pc2VfMS5Qcm9taXNlLmFsbChvYmopLnRoZW4oZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHByb2Nlc3NFbGVtZW50KG8sIHN1cHBvcnRBc3luYyk7IH0pIH1dKTtcclxuICAgICAgICByZXR1cm4gaXNBc3luYyA/IG5ldyBwcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXR1cm4gcHJvbWlzZV8xLlByb21pc2UuYWxsKG9iaikudGhlbihmdW5jdGlvbiAobykgeyByZXR1cm4gcmVzb2x2ZShwcm9jZXNzRWxlbWVudChvLCBzdXBwb3J0QXN5bmMpKTsgfSk7IH0pIDogcHJvY2Vzc0VsZW1lbnQoW29ialswXSwgb2JqWzFdLCBvYmpbMl1dLCBzdXBwb3J0QXN5bmMpO1xyXG4gICAgfVxyXG4gICAgdmFyIEFwcCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQXBwLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIEFwcCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX2NvbnRleHQuc2V0U3RhdGUgPSBfdGhpcy5zZXRBcHBTdGF0ZS5iaW5kKF90aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHAucHJvdG90eXBlLmNvbXBvbmVudFdpbGxNb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShfY29udGV4dC5zdGF0ZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFwcC5zdGF0ZUNoYW5nZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLnN0YXRlQ2hhbmdlZC5jYWxsKF90aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBcHAucHJvdG90eXBlLnNldEFwcFN0YXRlID0gZnVuY3Rpb24gKHByb3BzLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAocHJvcHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGtleXMpXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9jb250ZXh0LnN0YXRlLCBrZXlzW2ldLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3BzLCBrZXlzW2ldKSB8fCB7fSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcm9wcywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFwcC5zdGF0ZUNoYW5nZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLnN0YXRlQ2hhbmdlZC5jYWxsKF90aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFwcC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5yZW5kZXIuY2FsbCh0aGlzLCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBBcHA7XHJcbiAgICB9KF9jb25zdHJ1Y3QoYXBwLnVpLkNvbXBvbmVudCkpKTtcclxuICAgIHZhciBBc3luYyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQXN5bmMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQXN5bmMocHJvcHMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgcHJvcHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IF90aGlzLnByb3BzLnZhbHVlWzNdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQXN5bmMucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAocHJvbWlzZV8xLlByb21pc2UucHJvdG90eXBlLmlzUHJvdG90eXBlT2YodGhpcy5wcm9wcy52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnZhbHVlLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBfdGhpcy5zZXRTdGF0ZSh7IFwidmFsdWVcIjogdmFsdWUgfSk7IH0sIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIF90aGlzLnNldFN0YXRlKHsgXCJ2YWx1ZVwiOiBfdGhpcy5wcm9wcy52YWx1ZVs0XSA/IF90aGlzLnByb3BzLnZhbHVlWzRdKGVycikgOiBbXCJFeGNlcHRpb25cIiwgZXJyXSB9KTsgfSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucHJvcHMudmFsdWVbMF0gJiYgdGhpcy5wcm9wcy52YWx1ZVswXS50aGVuKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy52YWx1ZVswXS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gX3RoaXMuc2V0U3RhdGUoeyBcInZhbHVlXCI6IHZhbHVlIH0pOyB9LCBmdW5jdGlvbiAoZXJyKSB7IHJldHVybiBfdGhpcy5zZXRTdGF0ZSh7IFwidmFsdWVcIjogX3RoaXMucHJvcHMudmFsdWVbNF0gPyBfdGhpcy5wcm9wcy52YWx1ZVs0XShlcnIpIDogW1wiRXhjZXB0aW9uXCIsIGVycl0gfSk7IH0pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlXzEuUHJvbWlzZS5hbGwodGhpcy5wcm9wcy52YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIF90aGlzLnNldFN0YXRlKHsgXCJ2YWx1ZVwiOiB2YWx1ZSB9KTsgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7IGlmIChfdGhpcy5wcm9wcy52YWx1ZVs0XSlcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7IFwidmFsdWVcIjogX3RoaXMucHJvcHMudmFsdWVbNF0gfSk7IH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQXN5bmMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudmFsdWUgJiYgdHlwZW9mIHRoaXMuc3RhdGUudmFsdWUgIT09IFwic3RyaW5nXCIgPyBfc3VwZXIucHJvdG90eXBlLnJlbmRlci5jYWxsKHRoaXMsIHRoaXMuc3RhdGUudmFsdWUpIDogXCJcIjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBBc3luYztcclxuICAgIH0oX2NvbnN0cnVjdChhcHAudWkuQ29tcG9uZW50KSkpO1xyXG4gICAgdmFyIHVpID0gYXBwLmFwcDtcclxuICAgIGlmIChhcHAuZGVzaWduZXIpXHJcbiAgICAgICAgdWkgPSBbKHdpbmRvdy5wYXJlbnQgPT09IG51bGwgfHwgd2luZG93ID09PSB3aW5kb3cucGFyZW50KSA/IGFwcC5kZXNpZ25lciA6IGludGVyY2VwdF8xLkludGVyY2VwdCwgYXBwID8geyBmaWxlOiBhcHAuYXBwID8gJ3RvZG8nIC8qYXBwLmFwcC5fX2pzdCovIDogbnVsbCB9IDoge30sIHVpXTtcclxuICAgIGlmICh0eXBlb2YgdWkgPT09IFwiZnVuY3Rpb25cIiAmJiAhdWkucHJvdG90eXBlLnJlbmRlcilcclxuICAgICAgICB1aSA9IHVpKGNvbXBvbmVudHNfMS5JbmplY3QoYXBwLCBfY29udGV4dCwgUmVzb2x2ZSwgX2NvbnN0cnVjdChhcHAudWkuQ29tcG9uZW50KSwganN0Q29udGV4dCkpO1xyXG4gICAgdmFyIG1hcFJlY3Vyc2l2ZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKSA/IG9iai5tYXAoZnVuY3Rpb24gKHQpIHsgcmV0dXJuIG1hcFJlY3Vyc2l2ZSh0KTsgfSkgOiBvYmo7IH07XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh1aSkpXHJcbiAgICAgICAgdWkgPSBtYXBSZWN1cnNpdmUodWkpO1xyXG4gICAgZnVuY3Rpb24gb25QYXJzZWQodWkpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGFwcC50YXJnZXQgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpIHx8IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5pZClcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJtYWluXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgbG9jYXRlIHRhcmdldCAoXCIgKyAodGFyZ2V0ID8gJ25vdCBzcGVjaWZpZWQnIDogdGFyZ2V0KSArIFwiKSBpbiBodG1sIGRvY3VtZW50IGJvZHkuXCIpO1xyXG4gICAgICAgICAgICBpZiAoYXBwLnRpdGxlKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBhcHAudGl0bGU7XHJcbiAgICAgICAgICAgIC8vaWYgKG1vZHVsZSAmJiBtb2R1bGUuaG90KSBtb2R1bGUuaG90LmFjY2VwdCgpO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc0NoaWxkTm9kZXMoKSlcclxuICAgICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICBhcHAudWkucmVuZGVyKHByb2Nlc3NFbGVtZW50KFtBcHAsIF9jb250ZXh0LCB1aV0pLCB0YXJnZXQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKGFwcC5hc3luYykgPyBwYXJzZSh1aSwgdW5kZWZpbmVkLCB0cnVlKS50aGVuKG9uUGFyc2VkKSA6IG9uUGFyc2VkKHBhcnNlKHVpKSk7XHJcbn1cclxuZXhwb3J0cy5hcHAgPSBhcHA7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgdHJhbnNmb3JtXzEgPSByZXF1aXJlKFwiLi90cmFuc2Zvcm1cIik7XHJcbnZhciBwcm9taXNlXzEgPSByZXF1aXJlKFwiLi9wcm9taXNlXCIpO1xyXG5mdW5jdGlvbiBJbmplY3QoYXBwLCBDb250ZXh0LCBSZXNvbHZlLCBQcm94eSwgSnN0Q29udGV4dCkge1xyXG4gICAgdmFyIENvbXBvbmVudCA9IFByb3h5IHx8IGFwcC51aS5Db21wb25lbnQ7XHJcbiAgICB2YXIgTG9hZGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhMb2FkZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTG9hZGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvYWRlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgSnN0Q29udGV4dC5sb2FkKHRoaXMuc3RhdGUudXJsLCB0cnVlKS50aGVuKGZ1bmN0aW9uIChvYmopIHsgX3RoaXMuc2V0U3RhdGUoeyBjaGlsZHJlbjogb2JqIH0pOyB9LCBmdW5jdGlvbiAoZXJyKSB7IF90aGlzLnNldFN0YXRlKHsgY2hpbGRyZW46IFtcIkV4Y2VwdGlvblwiLCBlcnJdIH0pOyB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIExvYWRlci5wcm90b3R5cGUuY29tcG9uZW50V2lsbE1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFdpbGxVcGRhdGUoe30sIHRoaXMucHJvcHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTG9hZGVyLnByb3RvdHlwZS5jb21wb25lbnRXaWxsVXBkYXRlID0gZnVuY3Rpb24gKHByb3BzLCBuZXh0cHJvcHMpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja3VybChuZXh0cHJvcHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTG9hZGVyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGUgPSBmdW5jdGlvbiAocHJvcHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2t1cmwocHJvcHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTG9hZGVyLnByb3RvdHlwZS5jaGVja3VybCA9IGZ1bmN0aW9uIChwcm9wcykge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gdHlwZW9mIHByb3BzLnVybCA9PT0gXCJmdW5jdGlvblwiID8gcHJvcHMudXJsKCkgOiBwcm9wcy51cmw7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZSB8fCB0aGlzLnN0YXRlLnVybCAhPT0gdXJsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNoaWxkcmVuOiB0aGlzLnByb3BzLmNoaWxkcmVuLCB1cmw6IHVybCB9LCB0aGlzLmxvYWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc3RhdGUgfHwgdGhpcy5zdGF0ZS51cmwgPT09IHVybDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIExvYWRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5yZW5kZXIuY2FsbCh0aGlzLCB0aGlzLmNoZWNrdXJsKHRoaXMucHJvcHMpICYmIHRoaXMuc3RhdGUuY2hpbGRyZW4gJiYgdGhpcy5zdGF0ZS5jaGlsZHJlbi5sZW5ndGggPiAwID8gdGhpcy5zdGF0ZS5jaGlsZHJlbiA6IHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIExvYWRlcjtcclxuICAgIH0oQ29tcG9uZW50KSk7XHJcbiAgICAvKmxldCB7IHRpdGxlLCBkZXNpZ25lciwgdWksIHRhcmdldCwgLi4uaW5qZWN0IH0gPSBhcHA7XHJcbiAgICByZXR1cm4geyBDb21wb25lbnRcclxuICAgICAgICAsIENvbnRleHRcclxuICAgICAgICAsIExvYWRlclxyXG4gICAgICAgICwgY29tcG9uZW50cyA6IGFwcC5jb21wb25lbnRzXHJcbiAgICAgICAgLCAuLi5pbmplY3RcclxuICAgIH07Ki9cclxuICAgIHZhciBpbmogPSB7XHJcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXHJcbiAgICAgICAgQ29udGV4dDogQ29udGV4dCxcclxuICAgICAgICBMb2FkZXI6IExvYWRlcixcclxuICAgICAgICBSZXNvbHZlOiBSZXNvbHZlLFxyXG4gICAgICAgIFN0YXRlOiBDb250ZXh0LnN0YXRlLFxyXG4gICAgICAgIGNvbXBvbmVudHM6IGFwcC5jb21wb25lbnRzXHJcbiAgICB9O1xyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhcHApO1xyXG4gICAgZm9yICh2YXIgaSBpbiBrZXlzKVxyXG4gICAgICAgIGlmIChrZXlzW2ldICE9IFwidGl0bGVcIiAmJiBrZXlzW2ldICE9IFwiZGVzaWduZXJcIiAmJiBrZXlzW2ldICE9IFwidWlcIiAmJiBrZXlzW2ldICE9IFwidGFyZ2V0XCIpXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbmosIGtleXNbaV0sIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYXBwLCBrZXlzW2ldKSB8fCB7fSk7XHJcbiAgICByZXR1cm4gaW5qO1xyXG59XHJcbmV4cG9ydHMuSW5qZWN0ID0gSW5qZWN0O1xyXG5mdW5jdGlvbiB4aHIodXJsLCBwYXJzZSkge1xyXG4gICAgZnVuY3Rpb24gcGFyc2VDb250ZW50KHJxLCByZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBycS5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICBpZiAoY29udGVudFR5cGUgJiYgKGNvbnRlbnRUeXBlLnN1YnN0cigwLCBcImFwcGxpY2F0aW9uL2pzb25cIi5sZW5ndGgpID09IFwiYXBwbGljYXRpb24vanNvblwiIHx8IGNvbnRlbnRUeXBlLnN1YnN0cigwLCBcIm51bGw7XCIubGVuZ3RoKSA9PSBcIm51bGw7XCIpKSB7XHJcbiAgICAgICAgICAgIC8vdmFyIG91dHB1dCA9IHJlcXVpcmUoJ0BhcHBmaWJyZS9qc3QnKS50cmFuc2Zvcm0oSlNPTi5wYXJzZShycS5yZXNwb25zZVRleHQpKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtXzEudHJhbnNmb3JtQXN5bmMoSlNPTi5wYXJzZShycS5yZXNwb25zZVRleHQpLCB7fSwgZnVuY3Rpb24gKG91dHB1dCkgeyByZXNvbHZlKGV2YWwoXCJbXCIgKyBvdXRwdXQgKyBcIl1cIilbMF0pOyB9LCByZWplY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzb2x2ZShldmFsKHJxLnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHJxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHJxLm9wZW4oJ2dldCcsIHVybCwgdHJ1ZSwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJxLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChycS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShycS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUNvbnRlbnQocnEsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgcmVzcG9uc2UgZnJvbTogXCIgKyB1cmwgKyBcIiwgZXJyb3I6IFwiICsgZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChycS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBycS5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLnhociA9IHhocjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbnZhciB0cmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuL3RyYW5zZm9ybVwiKTtcclxuZXhwb3J0cy50cmFuc2Zvcm1TeW5jID0gdHJhbnNmb3JtXzEudHJhbnNmb3JtU3luYztcclxuZXhwb3J0cy50cmFuc2Zvcm1Bc3luYyA9IHRyYW5zZm9ybV8xLnRyYW5zZm9ybUFzeW5jO1xyXG52YXIgSnN0Q29udGV4dF8xID0gcmVxdWlyZShcIi4vSnN0Q29udGV4dFwiKTtcclxuZXhwb3J0cy5Db250ZXh0ID0gSnN0Q29udGV4dF8xLkpzdENvbnRleHQ7XHJcbnZhciBhcHBfMSA9IHJlcXVpcmUoXCIuL2FwcFwiKTtcclxuZXhwb3J0cy5hcHAgPSBhcHBfMS5hcHA7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgSW50ZXJjZXB0ID0gZnVuY3Rpb24gaW5qZWN0KF9hKSB7XHJcbiAgICB2YXIgQ29tcG9uZW50ID0gX2EuQ29tcG9uZW50O1xyXG4gICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoSW50ZXJjZXB0LCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIEludGVyY2VwdCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc3RhdGUgPSB7IGZvY3VzOiBmYWxzZSwgc2VsZWN0ZWQ6IGZhbHNlLCBlZGl0TW9kZTogbnVsbCwgY2FuRWRpdDogdHJ1ZSB9O1xyXG4gICAgICAgICAgICBfdGhpcy5vbk1lc3NhZ2UgPSBfdGhpcy5vbk1lc3NhZ2UuYmluZChfdGhpcyk7XHJcbiAgICAgICAgICAgIF90aGlzLmNsaWNrID0gX3RoaXMuY2xpY2suYmluZChfdGhpcyk7XHJcbiAgICAgICAgICAgIF90aGlzLm1vdXNlRW50ZXIgPSBfdGhpcy5tb3VzZUVudGVyLmJpbmQoX3RoaXMpO1xyXG4gICAgICAgICAgICBfdGhpcy5tb3VzZUxlYXZlID0gX3RoaXMubW91c2VMZWF2ZS5iaW5kKF90aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBJbnRlcmNlcHQucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgdGhpcy5vbk1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25jbGljayA9IGZ1bmN0aW9uICgpIHsgcGFyZW50LnBvc3RNZXNzYWdlKHsgZXZlbnRUeXBlOiBcInNlbGVjdFwiLCBjb3JyZWxhdGlvbklkOiBEYXRlLm5vdygpLnRvU3RyaW5nKCkgfSwgbG9jYXRpb24uaHJlZik7IH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBJbnRlcmNlcHQucHJvdG90eXBlLmNvbXBvbmVudFdpbGxVbm1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgdGhpcy5vbk1lc3NhZ2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgSW50ZXJjZXB0LnByb3RvdHlwZS5yZWNvbnN0cnVjdCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgaWYgKCFvYmpbMV0pXHJcbiAgICAgICAgICAgICAgICBvYmpbMV0gPSB7fTtcclxuICAgICAgICAgICAgaWYgKCFvYmpbMV0uc3R5bGUpXHJcbiAgICAgICAgICAgICAgICBvYmpbMV0uc3R5bGUgPSB7fTtcclxuICAgICAgICAgICAgaWYgKCFvYmpbMV0uc3R5bGUuYm9yZGVyICYmICFvYmpbMV0uc3R5bGUucGFkZGluZyAmJiAhb2JqWzFdLm9uTW91c2VFbnRlciAmJiAhb2JqWzFdLm9uTW91c2VMZWF2ZSkge1xyXG4gICAgICAgICAgICAgICAgb2JqWzFdLnN0eWxlLnBhZGRpbmcgPSB0aGlzLnN0YXRlLmZvY3VzIHx8IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyBcIjFweFwiIDogXCIycHhcIjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRNb2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIG9ialsxXS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJsaWdodGJsdWVcIjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIG9ialsxXS5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0ZS5mb2N1cylcclxuICAgICAgICAgICAgICAgICAgICBvYmpbMV0uc3R5bGUuYm9yZGVyID0gXCIxcHggZGFzaGVkIGdyZXlcIjtcclxuICAgICAgICAgICAgICAgIG9ialsxXS5vbk1vdXNlRW50ZXIgPSB0aGlzLm1vdXNlRW50ZXI7XHJcbiAgICAgICAgICAgICAgICBvYmpbMV0ub25Nb3VzZUxlYXZlID0gdGhpcy5tb3VzZUxlYXZlO1xyXG4gICAgICAgICAgICAgICAgb2JqWzFdLm9uQ2xpY2sgPSB0aGlzLmNsaWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBJbnRlcmNlcHQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy9yZXR1cm4gc3VwZXIucmVuZGVyKEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikgPyB0aGlzLnJlY29uc3RydWN0KFtcImRpdlwiLCB7c3R5bGU6IHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifX0sIHRoaXMucHJvcHMuY2hpbGRyZW5dKSAgOiB0aGlzLnJlY29uc3RydWN0KHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUucmVuZGVyLmNhbGwodGhpcywgdGhpcy5yZWNvbnN0cnVjdChbXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiIH0sIGtleTogMCB9LCB0aGlzLnByb3BzLmNoaWxkcmVuXSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgSW50ZXJjZXB0LnByb3RvdHlwZS5tb3VzZUVudGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3guRGVzaWduZXIubm90aWZ5KFwieFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFwiZm9jdXNcIjogdHJ1ZSB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEludGVyY2VwdC5wcm90b3R5cGUubW91c2VMZWF2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy94LkRlc2lnbmVyLm5vdGlmeShcInlcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBcImZvY3VzXCI6IGZhbHNlIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgSW50ZXJjZXB0LnByb3RvdHlwZS5jbGljayA9IGZ1bmN0aW9uIChldikge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgLy9EZXNpZ25lci5ub3RpZnkodGhpcy5wcm9wcy5maWxlKTtcclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHdpbmRvdztcclxuICAgICAgICAgICAgd2hpbGUgKHBhcmVudC5wYXJlbnQgIT09IHBhcmVudCAmJiB3aW5kb3cucGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB2YXIgY29ycmVsYXRpb25JZCA9IERhdGUubm93KCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgZXZlbnRUeXBlOiBcInNlbGVjdFwiLCBlZGl0TW9kZTogdGhpcy5zdGF0ZS5lZGl0TW9kZSwgY2FuRWRpdDogdGhpcy5zdGF0ZS5jYW5FZGl0LCBjb3JyZWxhdGlvbklkOiBjb3JyZWxhdGlvbklkLCBjb250cm9sOiB7IGZpbGU6IHRoaXMucHJvcHMuZmlsZSwgbWV0aG9kOiB0aGlzLnByb3BzLm1ldGhvZCB9IH0sIGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgXCJzZWxlY3RlZFwiOiBjb3JyZWxhdGlvbklkIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgSW50ZXJjZXB0LnByb3RvdHlwZS5vbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuc3Vic3RyKDAsIGV2Lm9yaWdpbi5sZW5ndGgpID09IGV2Lm9yaWdpbiAmJiBldi50eXBlID09IFwibWVzc2FnZVwiICYmIGV2LmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkID09IGV2LmRhdGEuY29ycmVsYXRpb25JZClcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2LmRhdGEuZXZlbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkZXNlbGVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXRNb2RlOiBldi5kYXRhLmVkaXRNb2RlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gSW50ZXJjZXB0O1xyXG4gICAgfShDb21wb25lbnQpKTtcclxufTtcclxuZXhwb3J0cy5JbnRlcmNlcHQgPSBJbnRlcmNlcHQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG52YXIgc3RhdGVzID0geyBwZW5kaW5nOiAwLCBzZXR0bGVkOiAxLCBmdWxmaWxsZWQ6IDIsIHJlamVjdGVkOiAzIH07XHJcbnZhciBhc3luY1F1ZXVlID0gW107XHJcbnZhciBhc3luY1RpbWVyO1xyXG5mdW5jdGlvbiBhc3luY0ZsdXNoKCkge1xyXG4gICAgLy8gcnVuIHByb21pc2UgY2FsbGJhY2tzXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFzeW5jUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhc3luY1F1ZXVlW2ldWzBdKGFzeW5jUXVldWVbaV1bMV0pO1xyXG4gICAgfVxyXG4gICAgLy8gcmVzZXQgYXN5bmMgYXN5bmNRdWV1ZVxyXG4gICAgYXN5bmNRdWV1ZSA9IFtdO1xyXG4gICAgYXN5bmNUaW1lciA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIGFzeW5jQ2FsbChjYWxsYmFjaywgYXJnKSB7XHJcbiAgICBhc3luY1F1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmddKTtcclxuICAgIGlmICghYXN5bmNUaW1lcikge1xyXG4gICAgICAgIGFzeW5jVGltZXIgPSB0cnVlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoYXN5bmNGbHVzaCwgMCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XHJcbiAgICBwcm9taXNlLl90aGVuID0gcHJvbWlzZS5fdGhlbi5mb3JFYWNoKGludm9rZUNhbGxiYWNrKTtcclxufVxyXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzdWJzY3JpYmVyKSB7XHJcbiAgICB2YXIgb3duZXIgPSBzdWJzY3JpYmVyLm93bmVyO1xyXG4gICAgdmFyIHNldHRsZWQgPSBvd25lci5fc3RhdGU7XHJcbiAgICB2YXIgdmFsdWUgPSBvd25lci5fZGF0YTtcclxuICAgIHZhciBjYWxsYmFjayA9IHNldHRsZWQgPT0gc3RhdGVzLmZ1bGZpbGxlZCA/IHN1YnNjcmliZXIuZnVsZmlsbGVkIDogc3Vic2NyaWJlci5yZWplY3RlZDtcclxuICAgIHZhciBwcm9taXNlID0gc3Vic2NyaWJlci50aGVuO1xyXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHNldHRsZWQgPSBzdGF0ZXMuZnVsZmlsbGVkO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZWplY3QocHJvbWlzZSwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKChzZXR0bGVkID09IHN0YXRlcy5mdWxmaWxsZWQgPyBcIlJlc29sdmVcIiA6IFwiUmVqZWN0XCIpICsgJyBub3QgaW1wbGVtZW50ZWQnKTtcclxuICAgIH1cclxuICAgIGlmICghaGFuZGxlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpKSB7XHJcbiAgICAgICAgaWYgKHNldHRsZWQgPT09IHN0YXRlcy5mdWxmaWxsZWQpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZXR0bGVkID09PSBzdGF0ZXMucmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW52b2tlUmVzb2x2ZXIocmVzb2x2ZXIsIHByb21pc2UpIHtcclxuICAgIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XHJcbiAgICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xyXG4gICAgICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXNvbHZlcihyZXNvbHZlUHJvbWlzZSwgcmVqZWN0UHJvbWlzZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdFByb21pc2UoZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xyXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlIHx8ICFoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcclxuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XHJcbiAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IHN0YXRlcy5wZW5kaW5nKSB7XHJcbiAgICAgICAgcHJvbWlzZS5fc3RhdGUgPSBzdGF0ZXMuc2V0dGxlZDtcclxuICAgICAgICBwcm9taXNlLl9kYXRhID0gdmFsdWU7XHJcbiAgICAgICAgYXN5bmNDYWxsKHB1Ymxpc2hGdWxmaWxsbWVudCwgcHJvbWlzZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xyXG4gICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBzdGF0ZXMucGVuZGluZykge1xyXG4gICAgICAgIHByb21pc2UuX3N0YXRlID0gc3RhdGVzLnNldHRsZWQ7XHJcbiAgICAgICAgcHJvbWlzZS5fZGF0YSA9IHJlYXNvbjtcclxuICAgICAgICBhc3luY0NhbGwocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcHVibGlzaEZ1bGZpbGxtZW50KHByb21pc2UpIHtcclxuICAgIHByb21pc2UuX3N0YXRlID0gc3RhdGVzLmZ1bGZpbGxlZDtcclxuICAgIHB1Ymxpc2gocHJvbWlzZSk7XHJcbn1cclxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XHJcbiAgICBwcm9taXNlLl9zdGF0ZSA9IHN0YXRlcy5yZWplY3RlZDtcclxuICAgIHB1Ymxpc2gocHJvbWlzZSk7XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpIHtcclxuICAgIHZhciByZXNvbHZlZCA9IGZhbHNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSkge1xyXG4gICAgICAgICAgICAvLyB0aGVuIHNob3VsZCBiZSByZXRyaWV2ZWQgb25seSBvbmNlXHJcbiAgICAgICAgICAgIHZhciB0aGVuID0gdmFsdWUudGhlbjtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09PSB2YWwpID8gZnVsZmlsbChwcm9taXNlLCB2YWwpIDogcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKCFyZXNvbHZlZCkge1xyXG4gICAgICAgICAgICByZWplY3QocHJvbWlzZSwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbnZhciBQcm9taXNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGVzLnBlbmRpbmc7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fdGhlbiA9IFtdO1xyXG4gICAgICAgIGludm9rZVJlc29sdmVyKHJlc29sdmVyLCB0aGlzKTtcclxuICAgIH1cclxuICAgIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQpIHtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IHtcclxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXHJcbiAgICAgICAgICAgIHRoZW46IG5ldyBQcm9taXNlKGZ1bmN0aW9uICgpIHsgfSksXHJcbiAgICAgICAgICAgIGZ1bGZpbGxlZDogb25mdWxmaWxsZWQsXHJcbiAgICAgICAgICAgIHJlamVjdGVkOiBvbnJlamVjdGVkXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoKG9ucmVqZWN0ZWQgfHwgb25mdWxmaWxsZWQpICYmICF0aGlzLl9oYW5kbGVkKVxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT09IHN0YXRlcy5mdWxmaWxsZWQgfHwgdGhpcy5fc3RhdGUgPT09IHN0YXRlcy5yZWplY3RlZClcclxuICAgICAgICAgICAgLy8gYWxyZWFkeSByZXNvbHZlZCwgY2FsbCBjYWxsYmFjayBhc3luY1xyXG4gICAgICAgICAgICBhc3luY0NhbGwoaW52b2tlQ2FsbGJhY2ssIHN1YnNjcmliZXIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgLy8gc3Vic2NyaWJlXHJcbiAgICAgICAgICAgIHRoaXMuX3RoZW4ucHVzaChzdWJzY3JpYmVyKTtcclxuICAgICAgICByZXR1cm4gc3Vic2NyaWJlci50aGVuO1xyXG4gICAgfTtcclxuICAgIFByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl0gPSBmdW5jdGlvbiAob25yZWplY3RlZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25yZWplY3RlZCk7XHJcbiAgICB9O1xyXG4gICAgUHJvbWlzZS5hbGwgPSBmdW5jdGlvbiAocHJvbWlzZXMpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvbWlzZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gUHJvbWlzZS5hbGwoKS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IDA7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlc29sdmVyKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZW1haW5pbmcrKztcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1yZW1haW5pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBwcm9taXNlOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlICYmIHR5cGVvZiBwcm9taXNlLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZXIoaSksIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXJlbWFpbmluZykge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uIChwcm9taXNlcykge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9taXNlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byBQcm9taXNlLnJhY2UoKS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHByb21pc2U7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb21pc2UgJiYgdHlwZW9mIHByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIDtcclxuICAgIHJldHVybiBQcm9taXNlO1xyXG59KCkpO1xyXG5leHBvcnRzLlByb21pc2UgPSBQcm9taXNlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxudmFyIHJlcSA9IGZ1bmN0aW9uICh2YWwsIHBhcnNlU2V0dGluZ3MsIHJlcWFzeW5jKSB7XHJcbiAgICB2YXIgZXhwciA9ICcnO1xyXG4gICAgdmFyIGtleXdvcmRzID0gW1widGhpc1wiLCBcInNlbGZcIiwgXCJ3aW5kb3dcIiwgXCJtb2R1bGVcIiwgXCJwYXJlbnRcIiwgXCJhbGVydFwiLCBcImNvbmZpcm1cIl07XHJcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHZhciB1cmkgPSB2YWwuc3BsaXQoJyMnKTtcclxuICAgICAgICB2YXIgYXN5bmMgPSB1cmlbMF0ubGVuZ3RoID4gMSAmJiB1cmlbMF0uY2hhckF0KDApID09ICd+JztcclxuICAgICAgICBpZiAoYXN5bmMpXHJcbiAgICAgICAgICAgIHVyaVswXSA9IHVyaVswXS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHVyaS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IDApXHJcbiAgICAgICAgICAgICAgICBleHByID0ga2V5d29yZHMuaW5kZXhPZih1cmlbaW5kZXhdKSA+IC0xID8gdXJpW2luZGV4XSA6IGFzeW5jID8gXCJvYmpcIiA6IFwiKFwiICsgKHJlcWFzeW5jID8gJ2F3YWl0ICcgOiAnJykgKyBcInJlcXVpcmUoXFxcIlwiICsgdXJpW2luZGV4XSArIFwiXFxcIikpXCI7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGV4cHIgPSBleHByICsgXCIuXCIgKyB1cmlbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXN5bmMpXHJcbiAgICAgICAgICAgIGV4cHIgPSBcImltcG9ydChcIiArICgnLicgKyB1cmlbMF0pICsgXCIpLnRoZW4oZnVuY3Rpb24ob2JqKXtyZXR1cm4gXCIgKyBleHByICsgXCJ9KVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvIHJlcSBcIiArIHZhbCk7XHJcbiAgICByZXR1cm4gZXhwcjtcclxufTtcclxudmFyIGltcCA9IGZ1bmN0aW9uICh2YWwsIHBhcnNlU2V0dGluZ3MpIHtcclxuICAgIHZhciBleHByID0gJyc7XHJcbiAgICB2YXIgdXJpID0gdmFsLnNwbGl0KCcjJyk7XHJcbiAgICB2YXIgYXN5bmMgPSB1cmlbMF0ubGVuZ3RoID4gMSAmJiB1cmlbMF0uY2hhckF0KDApID09ICd+JztcclxuICAgIGlmIChhc3luYylcclxuICAgICAgICB1cmlbMF0gPSB1cmlbMF0uc3Vic3RyaW5nKDEpO1xyXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHVyaS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBpZiAoaW5kZXggPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VTZXR0aW5ncy5pbXBvcnRzLmluZGV4T2YodXJpW2luZGV4XSkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBwYXJzZVNldHRpbmdzLmltcG9ydHMucHVzaCh1cmlbaW5kZXhdKTtcclxuICAgICAgICAgICAgZXhwciA9IFwiaW1wb3J0c1tcIiArIHBhcnNlU2V0dGluZ3MuaW1wb3J0cy5pbmRleE9mKHVyaVtpbmRleF0pICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZXhwciA9IGV4cHIgKyBcIi5cIiArIHVyaVtpbmRleF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxufTtcclxuZnVuY3Rpb24gcHJvY2VzcyhvYmosIGVzYywgZXQsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCkge1xyXG4gICAgaWYgKG9iaiA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgdmFyIGlubmVyID0gZmFsc2U7XHJcbiAgICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGlubmVyID0gKGlubmVyIHx8IEFycmF5LmlzQXJyYXkoeCkgfHwgKHggIT09IG51bGwgJiYgdHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LmtleXMoeCkubGVuZ3RoID4gMCkpOyB9KTtcclxuICAgICAgICByZXR1cm4gKGV0ID8gXCJcIiA6IFwiW1wiKSArIG9iai5tYXAoZnVuY3Rpb24gKGUsIGkpIHsgcmV0dXJuIChwYXJzZVNldHRpbmdzICYmIHBhcnNlU2V0dGluZ3MuaW5kZW50ID8gXCIgXCIgOiBcIlwiKSArIHByb2Nlc3MoZSwgZXNjLCBmYWxzZSwgcGFyc2VTZXR0aW5ncywgKG9mZnNldCB8fCAwKSArIDIpICsgKChpIDwgb2JqLmxlbmd0aCAmJiBwYXJzZVNldHRpbmdzLmluZGVudCAmJiBpbm5lciA/IFwiXFxyXFxuXCIgKyBuZXcgQXJyYXkob2Zmc2V0KS5qb2luKCcgJykgOiBcIlwiKSk7IH0pLmpvaW4oXCIsXCIpICsgKGV0ID8gXCJcIiA6IFwiXVwiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBrZXlzKVxyXG4gICAgICAgICAgICBpZiAoa2V5c1trXS5sZW5ndGggPiAwICYmIGtleXNba10uY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlU2V0dGluZ3MucGFyc2Vyc1trZXlzW2tdXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VTZXR0aW5ncy5wYXJzZXJzW2tleXNba11dKG9iaiwgb2Zmc2V0KSB8fCAnJztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGxvY2F0ZSBwYXJzZXIgXCIgKyBrZXlzW2tdLnN1YnN0cigxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB2YXIgaW5uZXIgPSBmYWxzZTtcclxuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKHgpIHsgcmV0dXJuIGlubmVyID0gKGlubmVyIHx8IEFycmF5LmlzQXJyYXkob2JqW3hdKSB8fCAob2JqW3hdICE9PSBudWxsICYmIHR5cGVvZiBvYmpbeF0gPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LmtleXMob2JqW3hdKS5sZW5ndGggPiAwKSk7IH0pO1xyXG4gICAgICAgIHJldHVybiAoZXQgPyBcIlwiIDogXCJ7XCIpICsga2V5cy5maWx0ZXIoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsubGVuZ3RoIDwgMiB8fCBrLnN1YnN0cigwLCAyKSAhPSAnLi4nOyB9KS5tYXAoZnVuY3Rpb24gKGssIGkpIHsgcmV0dXJuIChwYXJzZVNldHRpbmdzLmluZGVudCA/IFwiIFwiIDogXCJcIikgKyBcIlxcXCJcIiArIGsgKyBcIlxcXCI6IFwiICsgcHJvY2VzcyhvYmpba10sIGVzYywgZmFsc2UsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCkgKyAoKGkgPCBrZXlzLmxlbmd0aCAmJiBwYXJzZVNldHRpbmdzLmluZGVudCAmJiBpbm5lciA/IFwiXFxyXFxuXCIgKyBuZXcgQXJyYXkob2Zmc2V0KS5qb2luKCcgJykgOiBcIlwiKSk7IH0pLmpvaW4oXCIsXCIpICsgKGV0ID8gXCJcIiA6IFwifVwiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIikgLy8gb2JqZWN0IG5vdCBKU09OLi4uXHJcbiAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgJiYgZXNjID8gSlNPTi5zdHJpbmdpZnkob2JqKSA6IG9iajtcclxufVxyXG5mdW5jdGlvbiBpbml0aWFsaXplU2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHZhciBwYXJzZVNldHRpbmdzID0geyBwYXJzZXJzOiB7fSwgaW5kZW50OiBzZXR0aW5ncy5pbmRlbnQgPyA0IDogMCwgaW1wb3J0czogW10gfTtcclxuICAgIHBhcnNlU2V0dGluZ3MucGFyc2Vyc1tcIi5mdW5jdGlvblwiXSA9IGZ1bmN0aW9uIChvYmosIG9mZnNldCkgeyByZXR1cm4gXCJmdW5jdGlvbiBcIiArIChvYmpbXCIuZnVuY3Rpb25cIl0gPyBvYmpbXCIuZnVuY3Rpb25cIl0gOiBcIlwiKSArIFwiKFwiICsgKG9ialtcImFyZ3VtZW50c1wiXSA/IHByb2Nlc3Mob2JqW1wiYXJndW1lbnRzXCJdLCBmYWxzZSwgdHJ1ZSwgcGFyc2VTZXR0aW5ncywgb2Zmc2V0KSA6IFwiXCIpICsgXCIpeyByZXR1cm4gXCIgKyBwcm9jZXNzKG9ialtcInJldHVyblwiXSwgdHJ1ZSwgZmFsc2UsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCkgKyBcIiB9XCI7IH07XHJcbiAgICBwYXJzZVNldHRpbmdzLnBhcnNlcnNbXCIuYXBwXCJdID0gZnVuY3Rpb24gKG9iaiwgb2Zmc2V0KSB7XHJcbiAgICAgICAgdmFyIG9iajIgPSB7fTtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpXHJcbiAgICAgICAgICAgIG9iajJba2V5c1trZXldID09IFwiLmFwcFwiID8gXCJhcHBcIiA6IGtleXNba2V5XV0gPSBvYmpba2V5c1trZXldXTtcclxuICAgICAgICByZXR1cm4gXCJyZXF1aXJlKCdAYXBwZmlicmUvanN0JykuYXBwKCBcIiArIHByb2Nlc3Mob2JqMiwgdHJ1ZSwgZmFsc2UsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCkgKyBcIiApXCI7XHJcbiAgICB9O1xyXG4gICAgcGFyc2VTZXR0aW5ncy5wYXJzZXJzW1wiLm1hcFwiXSA9IGZ1bmN0aW9uIChvYmosIG9mZnNldCkgeyByZXR1cm4gcHJvY2VzcyhvYmpbXCIubWFwXCJdLCBmYWxzZSwgZmFsc2UsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCkgKyBcIi5tYXAoZnVuY3Rpb24oXCIgKyBvYmpbXCJhcmd1bWVudHNcIl0gKyBcIikge3JldHVybiBcIiArIChzZXR0aW5ncyAmJiBzZXR0aW5ncy5pbmRlbnQgPyBuZXcgQXJyYXkob2Zmc2V0KS5qb2luKCcgJykgOiBcIlwiKSArIHByb2Nlc3Mob2JqW1wicmV0dXJuXCJdLCB0cnVlLCBmYWxzZSwgcGFyc2VTZXR0aW5ncywgb2Zmc2V0KSArIFwiIH0pXCI7IH07XHJcbiAgICBwYXJzZVNldHRpbmdzLnBhcnNlcnNbXCIuZmlsdGVyXCJdID0gZnVuY3Rpb24gKG9iaiwgb2Zmc2V0KSB7IHJldHVybiBwcm9jZXNzKG9ialtcIi5maWx0ZXJcIl0sIGZhbHNlLCBmYWxzZSwgcGFyc2VTZXR0aW5ncywgb2Zmc2V0KSArIFwiLmZpbHRlcihmdW5jdGlvbihcIiArIG9ialtcImFyZ3VtZW50c1wiXSArIFwiKSB7cmV0dXJuIFwiICsgcHJvY2VzcyhvYmpbXCJjb25kaXRpb25cIl0sIHRydWUsIGZhbHNlLCBwYXJzZVNldHRpbmdzLCBvZmZzZXQpICsgXCIgfSlcIjsgfTtcclxuICAgIHBhcnNlU2V0dGluZ3MucGFyc2Vyc1tcIi5yZXF1aXJlXCJdID0gZnVuY3Rpb24gKG9iaiwgb2Zmc2V0KSB7IHJldHVybiByZXEob2JqW1wiLnJlcXVpcmVcIl0sIHBhcnNlU2V0dGluZ3MsIHNldHRpbmdzICYmIHNldHRpbmdzLmFzeW5jKTsgfTtcclxuICAgIHBhcnNlU2V0dGluZ3MucGFyc2Vyc1tcIi5pbXBvcnRcIl0gPSBmdW5jdGlvbiAob2JqLCBvZmZzZXQpIHsgcmV0dXJuIGltcChvYmpbXCIuaW1wb3J0XCJdLCBwYXJzZVNldHRpbmdzKTsgfTtcclxuICAgIHBhcnNlU2V0dGluZ3MucGFyc2Vyc1tcIi5cIl0gPSBmdW5jdGlvbiAob2JqLCBvZmZzZXQpIHsgcmV0dXJuIG9ialtcIi5cIl07IH07XHJcbiAgICByZXR1cm4gcGFyc2VTZXR0aW5ncztcclxufVxyXG4vKlxyXG5mdW5jdGlvbiBjaGFpbiAob2JqOmFueSwgc2V0dGluZ3M6SVBhcnNlU2V0dGluZ3MsIHJlc29sdmU6RnVuY3Rpb24sIHJlamVjdDpGdW5jdGlvbikge1xyXG4gICAgaWYgKG9iaiAmJiAhb2JqLnRoZW4pXHJcbiAgICAgICAgb2JqID0gcHJvY2VzcyhvYmosIHRydWUsIGZhbHNlLCBzZXR0aW5ncywgMCk7XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSl7XHJcbiAgICAgICAgbGV0IGFyIDogYW55W10gPSBbXTtcclxuICAgICAgICBvYmoucmVkdWNlUmlnaHQoZnVuY3Rpb24ocHJldiwgY3VyKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHIgKHY6YW55KSB7IGNoYWluKHYsIHNldHRpbmdzLCBmdW5jdGlvbiAocTphbnkpIHsgYXJbYXIubGVuZ3RoXSA9IHE7IHByZXYoYXIpOyB9LCByZWplY3QpIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyAoY3VyICYmIGN1ci50aGVuKSA/IGN1ci50aGVuKHIsIHJlamVjdCkgOiByKGN1cik7IH1cclxuICAgICAgICB9LCByZXNvbHZlKSgpO1xyXG4gICAgfSBlbHNlIGlmIChvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgbGV0IG8gOiB7W2tleTogc3RyaW5nXTphbnl9ID0ge307XHJcbiAgICAgICAgT2JqZWN0LmtleXMob2JqKS5yZWR1Y2VSaWdodChmdW5jdGlvbihwcmV2LCBjdXIpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gciAodjphbnkpIHsgY2hhaW4odiwgc2V0dGluZ3MsIGZ1bmN0aW9uKHE6YW55KSB7b1tjdXJdID0gcTsgcHJldihvKTsgfSwgcmVqZWN0KX1cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyAob2JqW2N1cl0udGhlbikgPyBvYmpbY3VyXS50aGVuKHIsIHJlamVjdCkgOiByKG9ialtjdXJdKTsgfVxyXG4gICAgICAgIH0sIHJlc29sdmUpKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChvYmogJiYgb2JqLnRoZW4pXHJcbiAgICAgICAgb2JqLnRoZW4oZnVuY3Rpb24gKHY6YW55KSB7cmVzb2x2ZShwcm9jZXNzKHYsIHRydWUsIGZhbHNlLCBzZXR0aW5ncywgMCkpfSwgcmVqZWN0KTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXNvbHZlKHByb2Nlc3Mob2JqLCB0cnVlLCBmYWxzZSwgc2V0dGluZ3MsIDApKTtcclxufSovXHJcbmZ1bmN0aW9uIHByb2Nlc3NBc3luYyhvYmosIGVzYywgZXQsIHBhcnNlU2V0dGluZ3MsIG9mZnNldCwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICBpZiAob2JqID09PSBudWxsKVxyXG4gICAgICAgIHJlc29sdmUoXCJudWxsXCIpO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgIHZhciBpbm5lciA9IGZhbHNlO1xyXG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7IHJldHVybiBpbm5lciA9IChpbm5lciB8fCBBcnJheS5pc0FycmF5KHgpIHx8ICh4ICE9PSBudWxsICYmIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5rZXlzKHgpLmxlbmd0aCA+IDApKTsgfSk7XHJcbiAgICAgICAgcmVzb2x2ZSgoZXQgPyBcIlwiIDogXCJbXCIpICsgb2JqLm1hcChmdW5jdGlvbiAoZSwgaSkgeyByZXR1cm4gKHBhcnNlU2V0dGluZ3MgJiYgcGFyc2VTZXR0aW5ncy5pbmRlbnQgPyBcIiBcIiA6IFwiXCIpICsgcHJvY2VzcyhlLCBlc2MsIGZhbHNlLCBwYXJzZVNldHRpbmdzLCAob2Zmc2V0IHx8IDApICsgMikgKyAoKGkgPCBvYmoubGVuZ3RoICYmIHBhcnNlU2V0dGluZ3MuaW5kZW50ICYmIGlubmVyID8gXCJcXHJcXG5cIiArIG5ldyBBcnJheShvZmZzZXQpLmpvaW4oJyAnKSA6IFwiXCIpKTsgfSkuam9pbihcIixcIikgKyAoZXQgPyBcIlwiIDogXCJdXCIpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBrZXlzKVxyXG4gICAgICAgICAgICBpZiAoa2V5c1trXS5sZW5ndGggPiAwICYmIGtleXNba10uY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlU2V0dGluZ3MucGFyc2Vyc1trZXlzW2tdXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdXRwdXQgPSBwYXJzZVNldHRpbmdzLnBhcnNlcnNba2V5c1trXV0ob2JqLCBvZmZzZXQsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvdXRwdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcIkNvdWxkIG5vdCBsb2NhdGUgcGFyc2VyIFwiICsga2V5c1trXS5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlubmVyID0gZmFsc2U7XHJcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7IHJldHVybiBpbm5lciA9IChpbm5lciB8fCBBcnJheS5pc0FycmF5KG9ialt4XSkgfHwgKG9ialt4XSAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqW3hdID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5rZXlzKG9ialt4XSkubGVuZ3RoID4gMCkpOyB9KTtcclxuICAgICAgICByZXNvbHZlKChldCA/IFwiXCIgOiBcIntcIikgKyBrZXlzLmZpbHRlcihmdW5jdGlvbiAoaykgeyByZXR1cm4gay5sZW5ndGggPCAyIHx8IGsuc3Vic3RyKDAsIDIpICE9ICcuLic7IH0pLm1hcChmdW5jdGlvbiAoaywgaSkgeyByZXR1cm4gKHBhcnNlU2V0dGluZ3MuaW5kZW50ID8gXCIgXCIgOiBcIlwiKSArIFwiXFxcIlwiICsgayArIFwiXFxcIjogXCIgKyBwcm9jZXNzKG9ialtrXSwgZXNjLCBmYWxzZSwgcGFyc2VTZXR0aW5ncywgb2Zmc2V0KSArICgoaSA8IGtleXMubGVuZ3RoICYmIHBhcnNlU2V0dGluZ3MuaW5kZW50ICYmIGlubmVyID8gXCJcXHJcXG5cIiArIG5ldyBBcnJheShvZmZzZXQpLmpvaW4oJyAnKSA6IFwiXCIpKTsgfSkuam9pbihcIixcIikgKyAoZXQgPyBcIlwiIDogXCJ9XCIpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIikgLy8gb2JqZWN0IG5vdCBKU09OLi4uXHJcbiAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiICYmIGVzYyA/IEpTT04uc3RyaW5naWZ5KG9iaikgOiBvYmo7XHJcbn1cclxuZnVuY3Rpb24gd3JhcFdpdGhQcm9taXNlcyh2YWwsIHBhcnNlU2V0dGluZ3MpIHtcclxuICAgIGlmIChwYXJzZVNldHRpbmdzLmltcG9ydHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHZhbCA9IFwicmVxdWlyZSAoW1xcXCJcIiArIHBhcnNlU2V0dGluZ3MuaW1wb3J0cy5qb2luKCdcIixcIicpICsgXCJcXFwiXSkudGhlbihmdW5jdGlvbiAoaW1wb3J0cykgeyByZXR1cm4gXCIgKyB2YWwgKyBcIiB9LCByZWplY3QpXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsO1xyXG59XHJcbmZ1bmN0aW9uIHRyYW5zZm9ybVN5bmMoanNvbiwgc2V0dGluZ3MpIHtcclxuICAgIHZhciBwYXJzZVNldHRpbmdzID0gaW5pdGlhbGl6ZVNldHRpbmdzKHNldHRpbmdzIHx8IHt9KTtcclxuICAgIHJldHVybiB3cmFwV2l0aFByb21pc2VzKHByb2Nlc3MoanNvbiwgdHJ1ZSwgZmFsc2UsIHBhcnNlU2V0dGluZ3MsIDApLCBwYXJzZVNldHRpbmdzKTtcclxufVxyXG5leHBvcnRzLnRyYW5zZm9ybVN5bmMgPSB0cmFuc2Zvcm1TeW5jO1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1Bc3luYyhqc29uLCBzZXR0aW5ncywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICB2YXIgcGFyc2VTZXR0aW5ncyA9IGluaXRpYWxpemVTZXR0aW5ncyhzZXR0aW5ncyB8fCB7fSk7XHJcbiAgICByZXR1cm4gcHJvY2Vzc0FzeW5jKGpzb24sIHRydWUsIGZhbHNlLCBwYXJzZVNldHRpbmdzLCAwLCBmdW5jdGlvbiAob3V0cHV0KSB7IHJldHVybiByZXNvbHZlKHdyYXBXaXRoUHJvbWlzZXMob3V0cHV0LCBwYXJzZVNldHRpbmdzKSk7IH0sIHJlamVjdCk7XHJcbn1cclxuZXhwb3J0cy50cmFuc2Zvcm1Bc3luYyA9IHRyYW5zZm9ybUFzeW5jO1xyXG4iLCJpbXBvcnQge2FwcCwgQ29udGV4dH0gZnJvbSAnQGFwcGZpYnJlL2pzdCc7XHJcblxyXG52YXIgZnIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG52YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHtcImFzeW5jXCI6XCJmYWxzZVwifSk7XHJcblxyXG5mdW5jdGlvbiB0cmFuc2Zvcm0oKSB7XHJcbiAgICB2YXIgcm93cyA9IHNvdXJjZS52YWx1ZS5zdWJzdHJpbmcoMCwgc291cmNlLnNlbGVjdGlvblN0YXJ0KS5zcGxpdCgnXFxuJyk7XHJcbiAgICBkaXZTdGF0dXMuaW5uZXJUZXh0ID0gXCJSb3c6IFwiICsgcm93cy5sZW5ndGggKyBcIiBDb2w6IFwiICsgcm93c1tyb3dzLmxlbmd0aC0xXS5sZW5ndGggKyBcIiBQb3NpdGlvbjogXCIgKyBzb3VyY2Uuc2VsZWN0aW9uU3RhcnQgKyBcIiBcIiArIChzb3VyY2Uuc2VsZWN0aW9uRW5kPnNvdXJjZS5zZWxlY3Rpb25TdGFydD9cIlNlbGVjdGlvbiBMZW5ndGg6IFwiICsgc291cmNlLnNlbGVjdGlvbkVuZC1zb3VyY2Uuc2VsZWN0aW9uU3RhcnQgKyBcIlwiOlwiXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2Zvcm1Bc3luYyhKU09OLnBhcnNlKHNvdXJjZS52YWx1ZSksIHsgaW5kZW50OiA0fSwgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGRpdlRyYW5zZm9ybS5pbm5lclRleHQgPSByZXN1bHRcclxuICAgICAgICAgICAgb3V0cHV0LmlubmVyVGV4dCA9IFwiTm8gZXJyb3JzXCI7XHJcbiAgICAgICAgICAgIG91dHB1dC5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQucnVuKHJlc3VsdCkudGhlbihmdW5jdGlvbiAoY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXcuaW5uZXJUZXh0ID0gIEpTT04uc3RyaW5naWZ5KGNvZGUsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtyZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgJiYgdmFsdWUubmFtZSA/ICd7Jyt2YWx1ZS5uYW1lKyd9JyA6IHZhbHVlfSwgNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlldy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXcuaW5uZXJUZXh0ID0gcmVhc29uO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXcuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBwcmV2aWV3LmlubmVyVGV4dCA9IGVycm9yO1xyXG4gICAgICAgICAgICBwcmV2aWV3LnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBwcmV2aWV3LmlubmVyVGV4dCA9IGU7XHJcbiAgICAgICAgcHJldmlldy5zdHlsZS5jb2xvciA9IFwicmVkXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdFNvdXJjZSh0ZXh0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG91dHB1dC5pbm5lclRleHQgPSBcIlwiO1xyXG4gICAgICAgIG91dHB1dC5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MoSlNPTi5wYXJzZSh0ZXh0KSwgdHJ1ZSwgZmFsc2UsIDApO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBvdXRwdXQuaW5uZXJUZXh0ID0gZTtcclxuICAgICAgICBvdXRwdXQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbkZpbGVMb2FkKCkge1xyXG4gICAgaWYgKGZpbGVpbnB1dC5maWxlcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgIGZyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBmdW5jdGlvbigpe3NvdXJjZS52YWx1ZSA9IGZyLnJlc3VsdH0pO1xyXG4gICAgICAgIGZyLnJlYWRBc1RleHQoZmlsZWlucHV0LmZpbGVzWzBdLnNsaWNlKCksIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgIH0gICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgICsgZW5jb2RlVVJJQ29tcG9uZW50KHNvdXJjZS52YWx1ZSkpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZWlucHV0LmZpbGVzLmxlbmd0aCA9PSAxID8gZmlsZWlucHV0LmZpbGVzWzBdLm5hbWUgOiBcImZpbGUuanNvblwiIClcclxuICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ2Rvd25sb2FkJztcclxuICAgIC8vICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgZWxlbWVudC5jbGljaygpO1xyXG4gICAgLy9kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkKHVybCkge1xyXG4gICAgdHJ5e1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignZ2V0JywnLi9kZWZhdWx0Lmpzb24nLCB0cnVlLCBudWxsLCBudWxsKTtcclxuICAgICAgICB4aHIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZS52YWx1ZSA9IHhoci5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuaW5uZXJUZXh0ID0gZTtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuc3R5bGUuY29sb3IgPSAncmVkJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5pbm5lckhUTUwgPSB4aHIucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnN0eWxlLmNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gXCJjb21wbGV0ZVwiKSAge1xyXG4gICAgICAgIHNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgYnRuRm9ybWF0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7c291cmNlLnZhbHVlID0gZm9ybWF0U291cmNlKHNvdXJjZS52YWx1ZSl9KTtcclxuICAgICAgICBmaWxlaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbkZpbGVMb2FkKTtcclxuICAgICAgICBzYXZlZmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNhdmUpO1xyXG4gICAgICAgIGxvYWQoJy4vYXNzZXRzL2RlZmF1bHQuanNvbicpOyAgICAgICAgXHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9