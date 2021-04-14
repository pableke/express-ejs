
const path = require("path"); //file and directory paths
const MyJson = require("../../../lib/myjson.js");

const menus = require("./menus.js");
const users = require("./users.js");

const myjson = new MyJson(path.join(__dirname, "../../../dbs/"));
const db = myjson.get("company") || myjson.createDB("company").get("company");

exports.menus = menus(db.get("menus") || db.createTable("menus").get("menus"));
exports.users = users(db.get("users") || db.createTable("users").get("users"));

exports.open = function() {
	console.log("> DAO Tests Factory open.");
	return this;
};

exports.close = function() {
	console.log("> DAO Tests Factory closed.");
	return this;
};
