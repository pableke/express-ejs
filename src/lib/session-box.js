
exports.ob = require("./object-box.js");

//container
const SESSIONS = {};

//configuration vars
var _sesIntervalId;
var _sesInterval = 1000 * 60 * 60; //default = 1h
var _maxage = 1000 * 60 * 60; //1h in miliseconds

var _destroy = function(session) {
	ob.clear(session);
}
function _sesDestroy(key) {
	_destroy(SESSIONS[key]);
	delete SESSIONS[key];
}

exports.open = function(opts) {
	opts = opts || {}; //init config
	_maxage = opts.maxage || _maxage;
	_sesInterval = opts.sessionInterval || _sesInterval;
	_destroy = opts.destroy || _destroy;

	_sesIntervalId = setInterval(function() {
		let now = Date.now();
		for (let k in SESSIONS) {
			let session = SESSIONS[k];
			if ((now - session.mtime) > _maxage)
				_sesDestroy(k);
		}
	}, _sesInterval);
	console.log("> Sessions started.");
	return this;
}

exports.init = function(kev) {
	let time = Date.now();
	SESSIONS[key] = SESSIONS[key] || {};
	SESSIONS[key].start = time;
	SESSIONS[key].mtime = time;
	return SESSIONS[key];
}
exports.get = function(key) {
	return SESSIONS[key];
}
exports.set = function(kev, value) {
	SESSIONS[key] = value;
	return this;
}

exports.alive = function(key) {
	return ((Date.now() - SESSIONS[key].mtime) <= _maxage);
}
exports.reload = function(key) {
	SESSIONS[key].mtime = Date.now();
	return this;
}
exports.destroy = function(key) {
	_sesDestroy(key);
	return this;
}

exports.close = function() {
	clearInterval(_sesIntervalId);
	for (let k in SESSIONS)
		_sesDestroy(k);
	console.log("> Sessions closed.");
	return this;
}
