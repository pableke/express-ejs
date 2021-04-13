
const path = require("path"); //file and directory paths
const MyJson = require("../../../lib/myjson.js");

const basedir = path.join(__dirname, "../../../dbs/");
const myjson = new MyJson(basedir);

const menus = require("./menus.js");

exports.menus = menus(myjson.get("company").get("menus"));

exports.open = function() {
	console.log("> DAO Tests Factory open.");
	return this;
};

exports.close = function() {
	console.log("> DAO Tests Factory closed.");
	return this;
};
