
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import formidable from "formidable"; //file uploads
import sharp from "sharp"; //image resizer
import jwt from "jsonwebtoken"; // JSON web token
import config from "../config.js";
import util from "./util.js";
import i18n from "app/lib/i18n-box.js";
import dao from "app/web/dao/factory.js";

const TPL_LOGIN = "web/login";
const forms = i18n.getForms();

export const view = function(req, res) {
	util.render(res, TPL_LOGIN);
}
function fnLogout(req) {
	delete req.session.menus; //remove menus
	//remove session: regenerated next request
	req.session.destroy(); //specific destroy
	delete req.session; //full destroy
}
export const logout = function(req, res) {
	fnLogout(req); //click logout user
	util.setBody(res, TPL_LOGIN).send(res, "msgLogout");
}
export const destroy = function(req, res) {
	fnLogout(req); //onclose even client
	res.send("ok"); //response ok
}

export const check = function(req, res, next) {
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
export const auth = function(req, res, next) {
	util.setBody(res, TPL_LOGIN); //if error => go login
	if (!req.session || !req.sessionID) //not session found
		return next("err401");
	if ((!req.session.ssId) || (req.session.cookie.maxAge < 1)) { //user not logged or time session expired
		req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl; // Update session helper
		return next(req.session.ssId ? "endSession" : "err401");
	}
	next(); //next middleware
}

const JWT_OPTIONS = { expiresIn: config.JWT_EXPIRES };
const COOKIE_OPTS = { maxAge: config.SESSION_EXPIRES, httpOnly: true };
export const sign = function(req, res, next) {
	util.setBody(res, TPL_LOGIN); // default view login
    const { login, clave } = req.body; // Inputs
	dao.sqlite.usuarios.login(login, clave).then(user => {
		req.session.ssId = user.id; // Important! autosave on res.send!
		const token = jwt.sign({ id: user.id }, config.JWT_KEY, JWT_OPTIONS); // get token
		res.cookie("token", token, COOKIE_OPTS).send(token); // send token and save session
	}).catch(next);
}
export const verify = function(req, res, next) {
	util.setBody(res, TPL_LOGIN); // default view login
	try {
		jwt.verify(req.cookies.token, config.JWT_KEY, (err, user) => {
			(err || !user) ? next(err || "err401") : next();
		});
	} catch (ex) {
		next(err);
	}
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
