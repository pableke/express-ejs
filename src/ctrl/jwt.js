
import jwt from "jsonwebtoken"; // JSON web token
import config from "../config.js";
import util from "app/ctrl/util.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";
import login from "app/model/login.js";

const TPL_LOGIN = "web/login";
const JWT_OPTIONS = { expiresIn: config.JWT_EXPIRES };
const COOKIE_OPTS = { maxAge: config.SESSION_EXPIRES, httpOnly: true };

function Jwt() {
	this.sign = function(req, res, next) {
		util.setBody(res, TPL_LOGIN); // default view login
		if (!login.validate(req.body)) // check errors
			return next(i18n.getError());

		const { login, clave } = req.body; // Inputs
		dao.sqlite.usuarios.login(login, clave).then(user => { // user exists
			req.session.ssId = user.id; // Important! autosave on res.send!
			const token = jwt.sign({ id: user.id }, config.JWT_KEY, JWT_OPTIONS); // get token
			res.cookie("token", token, COOKIE_OPTS).send(token); // send token and save session
		}).catch(next); // User not found, no login or clave error
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

export default new Jwt();
