
const fetch = require("node-fetch"); //ajax calls
const dao = require("app/dao/factory.js");
const util = require("app/lib/util-box.js");

exports.view = function(req, res) {
	res.build("web/forms/public/reactive");
}

exports.send = function(req, res) {
	//https://www.google.com/recaptcha/intro/v3.html
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PRIVATE}&response=` + req.body.token;
	fetch(url, { method: "post" })
		.then(res => res.json())
		.then(gresponse => {
			let i18n = res.locals.i18n;
			if (!gresponse.success || (gresponse.score < 0.51)) //is a boot?
				throw i18n.errCaptcha;

			try {
				res.locals.pass = valid.generatePassword(); //generate new random password
				dao.web.myjson.users.updatePassByMail(req.body.correo, res.locals.pass, i18n);

				util.sendMail({
					to: req.body.correo,
					subject: i18n.lblReactivar,
					tpl: "web/emails/reactive.ejs",
					data: res.locals
				}).then(info => res.send(i18n.msgReactive))
					.catch(err => next(i18n.errSendMail));
			} catch (ex) {
				next(ex);
			}
		})
		.catch(err => next(res.locals.i18n.errCaptcha));
}
