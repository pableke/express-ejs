
import config from "../config.js";
import api from "app/lib/api-box.js";
import util from "app/ctrl/util.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";
import login from "app/model/login.js";

const TPL_LOGIN = "web/login";

function Login() {
	const fnScore = info => (info.score > .5) ? Promise.resolve(info) : Promise.reject("¿Eres humano?");
	const reCaptcha = token => api.ajax.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_PRIVATE}&response=${token}`).then(fnScore);
	const fnLogin = (usuario, clave, token) => reCaptcha(token).then(info => dao.sqlite.usuarios.login(usuario, clave));
	this.view = function(req, res) {
		util.render(res, TPL_LOGIN, 0);
	}
	this.sign = function(req, res, next) {
		util.setBody(res, TPL_LOGIN, 0); // default view login
		if (!login.signin(req.body)) // check errors
			return next(i18n.getError());

		const { usuario, clave, token } = req.body; // read post data
		fnLogin(usuario, clave, token).then(user => { // user exists
			req.session.user = user; // Important! autosave on res.send!
			dao.sqlite.menus.serialize(user.id).then(tpl => { //specific user menus
				res.locals.menus = req.session.menus = tpl; //set on view and session
				// access allowed => go to private area
				let url = "/admin?m=msgLogin"; // default
				if (req.session.redirTo) { //session helper
					url = req.session.redirTo;
					delete req.session.redirTo;
				}
				res.redirect(url);
			});
		}).catch(next); // User not found, no login or clave error
	}
	this.verify = function(req, res, next) {
		util.setBody(res, TPL_LOGIN, 0); //if error => go login
		if (!req.session || !req.sessionID) //not session found
			return next("err401");
		if (!req.session.user || (req.session.cookie.maxAge < 1)) { //user not logged or time session expired
			req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl; // Update session helper
			return next(req.session.user ? "endSession" : "err401");
		}
		next(); //next middleware
	}

	function fnLogout(req) {
		delete req.session.user; //remove user id
		delete req.session.menus; //remove menus
		//remove session: regenerated next request
		req.session.destroy(); //specific destroy
		delete req.session; //full destroy
	}
	this.logout = function(req, res) {
		fnLogout(req); //click logout user
		util.setBody(res, TPL_LOGIN, 0).send(res, "msgLogout");
	}
	this.destroy = function(req, res) {
		fnLogout(req); //onclose even client
		res.send("ok"); //response ok
	}

	const MAIL_CONCAT = {
		to: config.ADMIN_EMAIL,
		subject: "Solicitud de información",
		body: "emails/contact.ejs"
	};
	this.viewContact = function(req, res) {
		util.render(res, TPL_LOGIN, 3);
	}
	this.contact = (req, res, next) => {
		// Clone resutls to avoid clean data before async call
		const data = Object.assign({}, login.contact(req.body));
		util.setBody(res, TPL_LOGIN, 0); // default view login
		if (i18n.isError())
			return util.errors(res);

		res.locals.body = data;
		MAIL_CONCAT.data = res.locals;
		reCaptcha(data.token)
			.then(captcha => util.sendMail(MAIL_CONCAT))
			.then(info => util.msg(res, "msgCorreo"))
			.catch(next);
	}

	const MAIL_SIGNUP = {
		subject: "Registro como nuevo usuario",
		body: "emails/signup.ejs"
	};
	this.viewSignup = function(req, res) {
		util.render(res, TPL_LOGIN, 1);
	}
	this.signup = (req, res, next) => {
		// Clone resutls to avoid clean data before async call
		const data = Object.assign({}, login.signup(req.body));
		if (i18n.isError())
			return util.errors(res);

		data.clave = valid.generatePassword(8); // build password
		reCaptcha(data.token).then(captcha => dao.sqlite.usuarios.insert(data)).then(id => {
			data.id = id; // set pk
			res.locals.user = data;
			MAIL_SIGNUP.to = data.email;
			MAIL_SIGNUP.data = res.locals;
			return util.sendMail(MAIL_SIGNUP);
		})
		.then(info => util.msg(res, "msgCorreo")).catch(next)
		.catch(next);
	}
	this.activate = (req, res, next) => {
		util.setBody(res, TPL_LOGIN, 0); // default view
		const fnResult = changes => (changes == 1) ? util.send(res, "msgUserActivated") : util.err500(res, "userNotFound");
		dao.sqlite.usuarios.activate(+req.query.id).then(fnResult).catch(next);
	}

	const MAIL_REMEMBER = {
		subject: "Nueva clave de acceso",
		body: "emails/remember.ejs"
	};
	this.viewRemember = function(req, res) {
		util.render(res, TPL_LOGIN, 2);
	}
	this.remember = (req, res, next) => {
		util.setBody(res, TPL_LOGIN, 0); // default view login
		if (!login.remember(req.body)) // check errors
			return next(i18n.getError());

		const { usuario, clave, token } = req.body; // read post data
		fnLogin(usuario, clave, token).then(user => {
			res.locals.user = user;
			res.locals.clave = user.clave;
			MAIL_REMEMBER.to = user.email;
			MAIL_REMEMBER.data = res.locals;
			return util.sendMail(MAIL_REMEMBER);
		})
		.then(info => util.msg(res, "msgCorreo"))
		.catch(next);
	}
}

export default new Login();
