
const path = require("path"); //file and directory paths
const myjson = require("app/lib/myjson.js");
const menus = require("./menus.js");
const users = require("./users.js");
const um = require("./users-menus.js");

const db = myjson.setPath(path.join(__dirname, "../../../dbs")).buildDB("company");
const tblMenus = menus(db.buildTable("menus"));
const tblUsers = users(db.buildTable("users"));
const tblUm = um(db.buildTable("um"), tblUsers, tblMenus);

exports.menus = tblMenus;
exports.users = tblUsers;
exports.um = tblUm;

exports.open = function() {
	myjson.load();
	return this;
};

exports.close = function() {
	return this;
};
