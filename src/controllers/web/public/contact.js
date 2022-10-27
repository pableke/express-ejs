
const i18n = require("app/lib/i18n-box.js");
const util = require("app/lib/util-box.js");

const TPL_CONTACT = "web/forms/public/contact";

exports.view = function(req, res) {
	res.build(TPL_CONTACT);
}

exports.send = function(req, res, next) {
	res.setBody(TPL_CONTACT); // set body tpl
	let lang = res.locals.lang; // current language
	let { nombre, correo, asunto, info } = req.body; // post data

	i18n.start(lang) // Initialize validator
		.required("info", info, "errSendContact").text("info", info, "errSendContact") //textarea
		.text200("asunto", asunto, "errSendContact", "errAsunto") //asunto
		.email("correo", correo, "errSendContact") //email
		.required("nombre", nombre, "errSendContact").text200("nombre", nombre, "errSendContact"); //nombre
	if (i18n.isError())
		return next(i18n);

	util.sendMail({
		to: "pableke@gmail.com",
		subject: i18n.get("lblFormContact"),
		body: "web/emails/contact.ejs",
		data: res.locals
	}).then(info => res.send(i18n.get("msgCorreo")))
		.catch(err => next("errSendMail"));
}
