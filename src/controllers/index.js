
import util from "app/mod/node-box.js";

const TPL_LOGIN = "web/forms/login";
const TPL_ADMIN = "web/list/index";

export const view = function(req, res) {
	util.render(res, TPL_LOGIN);
}

function fnLogout(req) {
	delete req.session.user; //remove user
	delete req.session.menus; //remove menus
	//remove session: regenerated next request
	req.session.destroy(); //specific destroy
	delete req.session; //full destroy
}

export const check = function(req, res, next) {
	let { usuario, clave } = req.body; // post data

	util.setBody(res, TPL_LOGIN); //if error => go login
	util.i18n.start(res.locals.lang) // current language
			.login("clave", clave, "errUserNotFound", "errClave") //password
			.user("usuario", usuario, "errUserNotFound", "errUsuario"); //email or login
	if (util.i18n.isError())
		return next(util.i18n);

	try {
		let user = dao.web.myjson.users.getUser(usuario, clave);
		let menus = dao.web.myjson.um.getAllMenus(user.id); //specific user menus
		let tpl = dao.web.myjson.menus.format(menus, { getValue: util.i18n.val }); //build template
		res.locals.menus = req.session.menus = tpl; //set on view and session
		req.session.user = user; //store user data in session

		// access allowed => go private area
		util.i18n.setOk("msgLogin"); // logIn == ok
		if (req.session.redirTo) //session helper
			res.redirect(req.session.redirTo);
		else
			res.render(TPL_ADMIN);
		delete req.session.redirTo;
	} catch (ex) {
		next(ex);
	}
}

export const auth = function(req, res, next) {
	util.setBody(res, TPL_LOGIN); //if error => go login
	if (!req.session || !req.sessionID) //not session found
		return next("err401");
	// Update session helper
	req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
	if (!req.session.user) //user not logged
		return next("err401");
	if (req.session.cookie.maxAge < 1) //time session expired
		return next("endSession");
	delete req.session.redirTo;
	next(); //next middleware
}

/*export const token = function(req, res, next) {
	try {
		const { usuario, clave } = req.data;
		const user = dao.web.myjson.users.getUser(usuario, clave, i18n);
		res.send(jwt.sign({ id: user.id }, process.env.JWT_KEY));
		req.session.ssId = user.id;
	} catch (ex) {
		next(ex);
	}
}

export const OAuth2 = function(req, res, next) {
	const token = req.headers["Authorization"];
	res.setBody(TPL_LOGIN); //if error => go login

	if (token && token.startsWith("Bearer")) {
		jwt.verify(token.substr(7), process.env.JWT_KEY, (err, user) => {
			if (err || !user || !user.id)
				return next(err || "err401");
			next();
		});
	}
	else
		next("err401");
}*/

export const home = function(req, res) {
	// Reset list configuration
	util.render(res, TPL_ADMIN);
}

export const logout = function(req, res) {
	fnLogout(req); //click logout user
	util.i18n.setOk("msgLogout");
	util.render(res, TPL_LOGIN);
}

export const destroy = function(req, res) {
	fnLogout(req); //onclose even client
    res.status(200).send("ok"); //response ok
}
