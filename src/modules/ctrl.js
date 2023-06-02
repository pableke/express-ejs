
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import formidable from "formidable"; //file uploads
import sharp from "sharp"; //image resizer
import jwt from "jsonwebtoken"; // JSON web token
import config from "../config.js";
import util from "./util.js";
import i18n from "app/lib/i18n-box.js";
import dao from "app/test/dao/factory.js";

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
export const logout = function(req, res) {
	fnLogout(req); //click logout user
	util.build(res, "msgLogout", TPL_LOGIN);
}
export const destroy = function(req, res) {
	fnLogout(req); //onclose even client
	util.text(res, "ok"); //response ok
}

export const home = function(req, res) {
	// Reset list configuration
	util.render(res, TPL_ADMIN);
}

export const check = function(req, res, next) {
	util.setBody(res, TPL_LOGIN); // default view login
	let { usuario, clave } = req.body; // read post data
	if (!util.i18n.vañidate(i18n.forms.login)) // check errors
		return next(util.i18n.getError());

	try {
		let user = dao.web.myjson.users.getUser(usuario, clave);
		let menus = dao.web.myjson.um.getAllMenus(user.id); //specific user menus
		let tpl = dao.web.myjson.menus.format(menus, { getValue: util.i18n.val }); //build template
		res.locals.menus = req.session.menus = tpl; //set on view and session
		req.session.user = user; //store user data in session

		// access allowed => go private area
		if (req.session.redirTo) //session helper
			res.redirect(req.session.redirTo);
		else
			util.build(res, "msgLogin", TPL_ADMIN);
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

const JWT_OPTIONS = { expiresIn: config.JWT_EXPIRES };
const COOKIE_OPTS = { maxAge: config.SESSION_EXPIRES, httpOnly: true };
export const sign = function(req, res, next) {
    const { login, clave } = req.body;
	dao.sqlite.users.login(login, clave).then(user => {
		const token = jwt.sign({ id: user.id }, config.JWT_KEY, JWT_OPTIONS);
		res.cookie("token", token, COOKIE_OPTS).send(token);
		req.session.ssId = user.id;
	}).catch(next);
}
export const verify = function(req, res, next) {
	const token = req.cookies.token || "no-token";
	jwt.verify(token, config.JWT_KEY, (err, user) => {
		util.setBody(res, TPL_LOGIN); //if error => go login
		(err || !user) ? next(err || "err401") : next();
	});
}

/******************* upload multipart files *******************/
const UPLOADS = {
	keepExtensions: true,
	uploadDir: config.DIR_UPLOADS,
	thumbDir: config.DIR_THUMBS,
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};
export const multipart = function(req, res, next) { //validate all form post
	const form = formidable(UPLOADS); //file upload options
	const fields = req.body = {}; //fields container

	form.on("field", function(field, value) {
		fields[field] = value;
	});
	form.on("fileBegin", function(field, file) {
		let name = path.basename(file.path).replace("upload_", "");
		file.path = path.join(path.dirname(file.path), name);
	});
	form.on("file", function(field, file) {
		fields[field] = fields[field] || [];
		if (file.size < 1) //empty uploaded file
			return fs.unlink(file.path, err => {});
		if (file.type.startsWith("image")) {
			sharp(file.path)
				.resize({ width: 250 })
				.toFile(path.join(UPLOADS.thumbDir, path.basename(file.path)))
				//.then(info => console.log(info))
				.catch(err => console.log(err));
		}
		fields[field].push(file);
	});
	form.once("error", err => next(err));
	form.once("end", () => next());
	form.parse(req);
}
/******************* upload multipart files *******************/
