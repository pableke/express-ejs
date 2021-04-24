
const path = require("path"); //file and directory paths
const myjson = require("app/myjson.js");
const menus = require("./menus.js");
const users = require("./users.js");

const db = myjson.setPath(path.join(__dirname, "../../../dbs"))
				.createDB("company").get("company");
exports.menus = menus(db.createTable("menus").get("menus"));
exports.users = users(db.createTable("users").get("users"));

exports.open = function() {
	myjson.load();
	return this;
};

exports.close = function() {
	return this;
};
