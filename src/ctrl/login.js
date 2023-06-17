
import config from "../config.js";
import util from "app/ctrl/util.js";
import i18n from "app/model/login.js";
import dao from "app/dao/factory.js";

const TPL_LOGIN = "web/login";
const form = i18n.getForms("login");

function Login() {
	this.view = function(req, res) {
		util.tabs(res, 0).render(res, TPL_LOGIN);
	}
	function fnLogout(req) {
		delete req.session.ssId; //remove user id
		delete req.session.menus; //remove menus
		//remove session: regenerated next request
		req.session.destroy(); //specific destroy
		delete req.session; //full destroy
	}
	this.logout = function(req, res) {
		fnLogout(req); //click logout user
		util.setBody(res, TPL_LOGIN).send(res, "msgLogout");
	}
	this.destroy = function(req, res) {
		fnLogout(req); //onclose even client
		res.send("ok"); //response ok
	}

	this.sign = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); // default view login
		if (!form.validate(req.body)) // check errors
			return next(i18n.getError());

		const { usuario, clave } = req.body; // read post data
		dao.sqlite.usuarios.login(usuario, clave).then(user => { // user exists
			req.session.ssId = user.id; // Important! autosave on res.send!
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
		util.setBody(res, TPL_LOGIN); //if error => go login
		if (!req.session || !req.sessionID) //not session found
			return next("err401");
		if (!req.session.ssId || (req.session.cookie.maxAge < 1)) { //user not logged or time session expired
			req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl; // Update session helper
			return next(req.session.ssId ? "endSession" : "err401");
		}
		next(); //next middleware
	}

	this.contact = (req, res) => {
		const data = form.contact(req.body);
		if (i18n.isError())
			return util.errors(res);

		res.locals.body = data;
		util.sendMail({
			to: config.ADMIN_EMAIL,
			subject: "Solicitud de información",
			body: "web/emails/contact.ejs",
			data: res.locals //data
		}).then(info => util.msg(res, "msgCorreo")).catch(next);
	}

	this.signup = (req, res, next) => {
		const data = form.signup(req.body);
		if (i18n.isError())
			return util.errors(res);

		data.clave = valid.generatePassword(8);
		dao.sqlite.usuarios.insert(data).then(id => {
			data.id = id; // set pk
			res.locals.user = data;
			util.sendMail({
				to: data.email,
				subject: "Registro como nuevo usuario",
				body: "web/emails/signup.ejs",
				data: res.locals //data
			}).then(info => util.msg(res, "msgCorreo")).catch(next);
		}).catch(next);
	}
	this.activate = (req, res, next) => {
		util.setBody(res, TPL_LOGIN).tabs(res, 1); // default view
		dao.sqlite.usuarios.getById(req.query.id).then(user => {
			if (!user) // user not in system
				return next("userNotFound");
			dao.sqlite.usuarios.activate(user.id).then(changes => {
				util.send(res, "msgUserActivated");
			});
		}).catch(next);
	}

	this.remember = (req, res, next) => {
		if (!form.remember(req.body)) // check errors
			return next(i18n.getError());
	
		const { usuario, clave } = req.body; // read post data
		dao.sqlite.usuarios.login(usuario, clave).then(user => {
			res.locals.clave = user.clave;
			//res.locals.user = user;
			util.sendMail({
				to: user.email,
				subject: "Nueva clave de acceso",
				body: "web/emails/remember.ejs",
				data: res.locals //data
			}).then(info => util.msg(res, "msgCorreo")).catch(next);
		}).catch(next);
	}
}

export default new Login();
