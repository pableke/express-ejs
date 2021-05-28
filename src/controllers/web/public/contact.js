
const mailer = require("app/lib/mailer.js");
const valid = require("app/lib/validator-box.js")

exports.view = function(req, res) {
	res.build("web/forms/public/contact");
}

exports.send = function(req, res, next) {
	mailer.send({
		to: "pableke@gmail.com",
		subject: res.locals.i18n.lblFormContact,
		tpl: "web/emails/contact.ejs",
		data: res.locals
	}).then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => next(res.locals.i18n.errSendMail));
}
