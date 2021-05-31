
const mailer = require("app/lib/mailer.js");

exports.view = function(req, res) {
	res.build("web/forms/public/contact");
}

exports.send = function(req, res, next) {
	let i18n = res.locals.i18n;

	mailer.send({
		to: "pableke@gmail.com",
		subject: i18n.lblFormContact,
		tpl: "web/emails/contact.ejs",
		data: res.locals
	}).then(info => res.setOk(i18n.msgCorreo).msgs())
		.catch(err => next(i18n.errSendMail));
}

// Error handlers
exports.error = function(err, req, res, next) {
	res.setBody("web/forms/public/contact"); //same body
	next(err); //go next error handler
}
