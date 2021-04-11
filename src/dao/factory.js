
const tests = require("./tests/factory.js");
const web = require("./web/factory.js");

exports.open = function() {
	tests.open();
	web.open();
	console.log("> DAO Factory open.");
	return this;
};

exports.close = function() {
	tests.close();
	web.close();
	console.log("> DAO Factory closed.");
	return this;
};
