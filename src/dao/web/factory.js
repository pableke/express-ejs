
const myjson = require("./myjson/factory.js");
const mysql = require("./mysql/factory.js");

exports.myjson = myjson;
exports.mysql = mysql;

exports.open = function() {
	myjson.open();
	mysql.open();
	console.log("> DAO Web Factory open.");
	return this;
};

exports.close = function() {
	myjson.close();
	mysql.close();
	console.log("> DAO Web Factory closed.");
	return this;
};
