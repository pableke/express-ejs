
const fetch = require("node-fetch"); //ajax calls
const dao = require("../../../dao/factory.js");
const mailer = require("../../../lib/mailer.js");
const valid = require("../../../lib/validator-box.js")

exports.view = function(req, res) {
	res.build("web/forms/reactive");
}

exports.save = function(req, res) {
	//https://www.google.com/recaptcha/intro/v3.html
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PRIVATE}&response=` + req.body.token;
	fetch(url, { method: "post" })
		.then(res => res.json())
		.then(gresponse => {
			let tpl = "web/emails/reactive.ejs"; //email template path base = /views
			if (gresponse.success && (gresponse.score > 0.5)) { //is a boot?
				res.locals.pass = valid.generatePassword(); //generate new random password
				dao.web.myjson.users.updatePassByMail(req.body.correo, res.locals.pass, res.locals.i18n);
				mailer.send("pableke@gmail.com", "Reactivar cuenta", tpl, res.locals)
					.then(info => res.send(res.locals.i18n.msgReactive))
					.catch(err => res.send(res.locals.i18n.errSendMail));
			}
			else
				res.status(500).json(valid.setMsgError(res.locals.i18n.errCaptcha).getMsgs());
		})
		.catch(err => res.status(500).json(valid.setMsgError(res.locals.i18n.errCaptcha).getMsgs()));
}
