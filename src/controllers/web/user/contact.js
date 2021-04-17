
const mailer = require("../../../lib/mailer.js");

exports.view = function(req, res) {
	res.build("web/forms/contact");
}

exports.save = function(req, res) {
	let fields = req.body; //request fields
	if (sv.contact(fields)) //fields error?
		return res.jerr(sv.getErrors());

	res.set("tplSection", "dist/mails/contact.html");
	let html = res.build("dist/mails/index.html").getValue();
	mailer.send("pablo.rosique@upct.es", "Email de contacto", html)
		.then(info => { res.text(res.get("msgCorreo")); })
		.catch(err => { res.jerr(sv.getErrors()); });
}
