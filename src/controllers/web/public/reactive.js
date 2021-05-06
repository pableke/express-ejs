
const fetch = require("node-fetch"); //ajax calls
const dao = require("app/dao/factory.js");
const mailer = require("app/lib/mailer.js");
const valid = require("app/lib/validator-box.js")

valid.setForm("/reactive.html", {
	token: valid.token,
	correo: valid.correo
});

function fnError(res, msg) {
	valid.setMsgError(msg);
	res.status(500).send(msg);
}

exports.view = function(req, res) {
	res.build("web/forms/reactive");
}

exports.send = function(req, res) {
	//https://www.google.com/recaptcha/intro/v3.html
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PRIVATE}&response=` + req.body.token;
	fetch(url, { method: "post" })
		.then(res => res.json())
		.then(gresponse => {
			if (!gresponse.success || (gresponse.score < 0.51)) //is a boot?
				return fnError(res, res.locals.i18n.errCaptcha);

			res.locals.pass = valid.generatePassword(); //generate new random password
			if (!dao.web.myjson.users.updatePassByMail(req.body.correo, res.locals.pass, res.locals.i18n))
				return fnError(res, valid.getMsgError());

			mailer.send({
				to: req.body.correo,
				subject: res.locals.i18n.lblReactivar,
				tpl: "web/emails/reactive.ejs",
				data: res.locals
			}).then(info => res.send(res.locals.i18n.msgReactive))
				.catch(err => fnError(res, res.locals.i18n.errSendMail));
		})
		.catch(err => fnError(res, res.locals.i18n.errCaptcha));
}
