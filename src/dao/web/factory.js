
const myjson = require("./myjson/factory.js");

exports.myjson = myjson;

exports.open = function() {
	myjson.open();
	console.log("> DAO Web Factory open.");
	return this;
};

exports.close = function() {
	myjson.close();
	console.log("> DAO Web Factory closed.");
	return this;
};
