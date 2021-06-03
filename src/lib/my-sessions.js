
exports.ob = require("./object-box.js");

//container
const SESSIONS = {};

//configuration vars
var _sesIntervalId;
var _maxage = 1000 * 60 * 60; //1h in miliseconds
var _sessionInterval = 1000 * 60 * 60; //default = 1h

//fully destroy sessions
function destroySession(key) {
	ob.clear(SESSIONS[key]);
	delete SESSIONS[key];
}

exports.open = function(opts) {
	opts = opts || {}; //init config
	_maxage = opts.maxage || _maxage;

	_sesIntervalId = setInterval(function() {
		let now = Date.now();
		for (let k in SESSIONS) {
			let session = SESSIONS[k];
			if ((now - session.mtime) > _maxage)
				destroySession(k);
		}
	}, opts.sessionInterval || _sessionInterval);
	return this;
}

exports.close = function() {
	clearInterval(_sesIntervalId);
	for (let k in SESSIONS)
		destroySession(k);
	console.log("> Sessions closed.");
	return this;
}
