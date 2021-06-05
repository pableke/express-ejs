
const ob = require("./object-box.js");

//container
const SESSIONS = {};

//configuration vars
var _sesIntervalId;
var _sesInterval = 1000 * 60 * 60; //default = 1h
var _maxage = 1000 * 60 * 60; //1h in miliseconds

function _destroy(key) {
	ob.clear(SESSIONS[key]);
	delete SESSIONS[key];
}

exports.open = function(opts) {
	opts = opts || {}; //init config
	_maxage = opts.maxage || _maxage;
	_sesInterval = opts.sessionInterval || _sesInterval;

	/*_sesIntervalId = setInterval(function() {
		let now = Date.now();
		for (let k in SESSIONS) {
			let session = SESSIONS[k];
			if ((now - session.mtime) > _maxage)
				_destroy(k);
		}
	}, _sesInterval);*/
	console.log("> Sessions started.");
	return this;
}

exports.init = function(key) {
	SESSIONS[key] = { start: Date.now() };
	return SESSIONS[key];
}
exports.get = function(key) {
	return SESSIONS[key];
}
exports.destroy = function(key) {
	_destroy(key);
	return this;
}

exports.close = function() {
	//clearInterval(_sesIntervalId);
	for (let k in SESSIONS)
		_destroy(k);
	console.log("> Sessions closed.");
	return this;
}
