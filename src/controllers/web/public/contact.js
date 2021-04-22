
const mailer = require("../../../lib/mailer.js");
const valid = require("../../../lib/validator-box.js")

const FORM = {
	nombre: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: valid.required
};
valid.setForm("/contact.html", FORM)
	.setForm("/contacto.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/contact");
}

exports.send = function(req, res) {
	let tpl = "web/emails/reactive.ejs"; //email template path base = /views
	res.locals.pass = valid.generatePassword(); //generate new password
	mailer.send("pableke@gmail.com", "Email de contacto", tpl, res.locals)
		.then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => fnError(res, res.locals.i18n.errSendMail));
}
