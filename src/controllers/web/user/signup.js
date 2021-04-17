
const dao = require("../../../dao/factory.js");
const mailer = require("../../../lib/mailer.js");
const valid = require("../../../lib/validator-box.js")

exports.view = function(req, res) {
	res.build("web/forms/signup");
}

exports.save = function(req, res) {
	res.send("user sign up successfully!");
}
