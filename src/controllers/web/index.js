
const login = require("./public/login.js");

exports.index = function(req, res) {
	res.build("web/index");
}

exports.auth = login.auth;
