
const myjson = require("./myjson/factory.js");

exports.myjson = myjson;

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
