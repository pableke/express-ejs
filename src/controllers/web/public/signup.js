
const dao = require("app/dao/factory.js");
const mailer = require("app/lib/mailer.js");
const valid = require("app/lib/validator-box.js")

exports.view = function(req, res) {
	res.build("web/forms/public/signup");
}

exports.save = function(req, res, next) {
	let i18n = res.locals.i18n;
	try {
		req.data.alta = new Date(); //set insert date time
		dao.web.myjson.users.insertUser(req.data, i18n);
		res.send(i18n.msgUsuario);
	} catch(ex) {
		next(ex);
	}
}
