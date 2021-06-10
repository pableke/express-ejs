
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const dao = require("app/dao/factory.js"); //DAO factory
const i18n = require("app/i18n/i18n.js"); //languages
const valid = require("./validators.js");
const session = require("app/lib/session-box.js");

const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(__dirname, "../public/files/"),
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

exports.lang = function(req, res, next) {
	let lang = req.query.lang || req.session.lang;
	if (!lang || (lang !== req.session.lang)) //user change language or first access
		lang = i18n.get(lang, req.headers["accept-language"]); //get language
	req.session.lang = res.locals.lang = lang; //set lang id on session and view
	// Load specific user menus or public menus on view
	req.sessionStorage = session.get(req.session.ssId);
	res.locals.menus = req.sessionStorage ? req.sessionStorage.menus : dao.web.myjson.menus.getPublic();
	next(); //go next middleware
}

exports.get = function(req, res, next) { //validate all form post
	let i18n = res.locals.i18n; //get internacionalization
	res.locals.body = req.query; //preserve client inputs
	let i = req.originalUrl.lastIndexOf("?"); // has params?
	let pathname = (i < 0) ? req.originalUrl : req.originalUrl.substr(0, i);
	if (valid.init(req.query, i18n).validate(pathname)) { //validate inputs form
		req.data = valid.getData(); //build data from inputs
		next(); //all inputs ok => go next middleware
	}
	else
		next(valid.closeMsgs(i18n.errForm));
}

exports.post = function(req, res, next) { //validate all form post
	let i18n = res.locals.i18n; //get internacionalization
	res.locals.body = req.body; //preserve client inputs
	if (!valid.init(req.body, i18n).validate(req.originalUrl))
		return next(valid.closeMsgs(i18n.errForm));

	// Returns inputs and parsed data to view
	req.data = valid.getData(); //build data from inputs
	// Inputs values are valids => process POST request
	let enctype = req.headers["content-type"] || ""; //get content-type
	if (enctype.startsWith("multipart/form-data")) { //multipart => files
		const fields = req.body = {}; //fields container
		const form = formidable(UPLOADS); //file upload options
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
					.toFile(path.join(__dirname, "../public/thumb/", path.basename(file.path)))
					//.then(info => console.log(info))
					.catch(err => console.log(err));
			}
			fields[field].push(file);
		});
		form.once("error", err => next(err));
		form.once("end", () => next());
		form.parse(req);
	}
	else
		next();
}
