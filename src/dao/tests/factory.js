
const myjson = require("../../lib/myjson.js");

exports.open = function() {
	myjson.open();
	console.log("> DAO Tests Factory open.");
	return this;
};

exports.close = function() {
	myjson.close();
	console.log("> DAO Tests Factory closed.");
	return this;
};
