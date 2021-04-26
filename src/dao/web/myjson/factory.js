
const path = require("path"); //file and directory paths
const myjson = require("app/lib/myjson.js");
const menus = require("./menus.js");
const users = require("./users.js");

const db = myjson.setPath(path.join(__dirname, "../../../dbs")).buildDB("company");
exports.menus = menus(db.buildTable("menus"));
exports.users = users(db.buildTable("users"));

exports.open = function() {
	myjson.load();
	return this;
};

exports.close = function() {
	return this;
};
