
const path = require("path"); //file and directory paths
const myjson = require("../../../lib/myjson.js");

const menus = require("./menus.js");
const users = require("./users.js");

myjson.open(path.join(__dirname, "../../../dbs/"));
const db = myjson.buildDB("company");

exports.menus = menus(db.buildTable("menus"));
exports.users = users(db.buildTable("users"));

exports.open = function() {
	return this;
};

exports.close = function() {
	return this;
};
