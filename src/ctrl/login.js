
import jwt from "jsonwebtoken"; // JSON web token
import config from "../config.js";
import util from "app/ctrl/util.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";

const TPL_LOGIN = "forms/login";
const forms = i18n.getForms();

function Login() {
	this.view = function(req, res) {
		util.render(res, TPL_LOGIN);
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

	this.check = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); // default view login
		if (!forms.login(req.body)) // check errors
			return next(i18n.getError());
	
		const { usuario, clave } = req.body; // read post data
		dao.sqlite.usuarios.login(usuario, clave).then(user => {
			if (!user) // user not in system
				return next("userNotFound");
	
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
		}).catch(next);
	}
	this.auth = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); //if error => go login
		if (!req.session || !req.sessionID) //not session found
			return next("err401");
		if (!req.session.ssId || (req.session.cookie.maxAge < 1)) { //user not logged or time session expired
			req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl; // Update session helper
			return next(req.session.ssId ? "endSession" : "err401");
		}
		next(); //next middleware
	}
	
	const JWT_OPTIONS = { expiresIn: config.JWT_EXPIRES };
	const COOKIE_OPTS = { maxAge: config.SESSION_EXPIRES, httpOnly: true };
	this.sign = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); // default view login
		if (!forms.login(req.body)) // check errors
			return next(i18n.getError());

		const { login, clave } = req.body; // Inputs
		dao.sqlite.usuarios.login(login, clave).then(user => {
			req.session.ssId = user.id; // Important! autosave on res.send!
			const token = jwt.sign({ id: user.id }, config.JWT_KEY, JWT_OPTIONS); // get token
			res.cookie("token", token, COOKIE_OPTS).send(token); // send token and save session
		}).catch(next);
	}
	this.verify = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); // default view login
		try {
			jwt.verify(req.cookies.token, config.JWT_KEY, (err, user) => {
				(err || !user) ? next(err || "err401") : next();
			});
		} catch (ex) {
			next(err);
		}
	}
}

export default new Login();
