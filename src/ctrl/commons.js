
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import formidable from "formidable"; //file uploads
import sharp from "sharp"; //image resizer

import config from "../config.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";

import sb from "app/lib/string-box.js";

const UPLOADS = {
	keepExtensions: true,
	uploadDir: config.DIR_UPLOADS,
	thumbDir: config.DIR_THUMBS,
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

function Commons() {
	this.lang = function(req, res, next) { // Load specific language in server
		const lang = req.query.lang || req.session.lang || sb.substr(req.headers["accept-language"], 0, 5);
		res.locals.i18n = i18n.setLang(lang).getLang(); // Selected language
		req.session.lang = res.locals.i18n.lang; // Save current lang
	
		res.locals.menus = req.session.menus || dao.sqlite.menus.getPublic();
		res.locals.body = { _tplBody: "web/index" }; // Set data on response
		res.locals.msgs = i18n.getMsgs(); // Set messages on view
		res.on("finish", i18n.reset); // Close response event
		next(); // Go next middleware
	}

	/******************* upload multipart files *******************/
	this.multipart = function(req, res, next) { //validate all form post
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
}

export default new Commons();
