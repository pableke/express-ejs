
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

	i18n.start(lang).text("info", info, "errSendContact", "errRequired"); //textarea
	i18n.text200("asunto", asunto, "errSendContact", "errAsunto"); //asunto
	i18n.email("correo", correo, "errSendContact", "errCorreo"); //email
	i18n.text200("nombre", nombre, "errSendContact", "errRequired"); //nombre
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
