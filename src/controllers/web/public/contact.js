
const mailer = require("app/lib/mailer.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	nombre: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: valid.required
};
valid.setForm("/contact.html", FORM)
	.setForm("/contacto.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/public/contact");
}

exports.send = function(req, res) {
	mailer.send({
		to: "pableke@gmail.com",
		subject: res.locals.i18n.lblFormContact,
		tpl: "web/emails/contact.ejs",
		data: res.locals
	}).then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => fnError(res, res.locals.i18n.errSendMail));
}
