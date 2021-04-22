
const mailer = require("../../../lib/mailer.js");

exports.view = function(req, res) {
	res.build("web/forms/contact");
}

exports.save = function(req, res) {
	res.locals.pass = "asklñdfjasd fsd";
	let tpl = "web/emails/reactive.ejs"; //email template path base = /views
	mailer.send("pableke@gmail.com", "Email de contacto", tpl, res.locals)
		.then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => fnError(res, res.locals.i18n.errSendMail));
}
