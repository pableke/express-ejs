
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")
const login = require("./web/public/login.js");
const i18n = require("../i18n/i18n.js"); //languages

const BODY = {};
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
	if (!lang || (lang !== req.session.lang)) {
		//user has changed current language or first access
		let ac = req.headers["accept-language"] || i18n.default; //default laguage = es
		lang = (i18n[lang]) ? lang : ac.substr(0, 5); //search region language es-ES
		lang = (i18n[lang]) ? lang : lang.substr(0, 2); //search type language es
		lang = (i18n[lang]) ? lang : i18n.default; //default language = es
		req.session.lang = lang; //save language on session
	}
	res.locals.lang = lang; //lang id
	res.locals.body = BODY; //init non-ajax body forms
	res.locals.msgs = valid.getMsgs(); //init messages
	// Load specific user menus or load publics
	req.session.menus = req.session.menus || dao.web.myjson.menus.getPublic(); //public menu
	res.locals.menus = req.session.menus; //set menus on view
	next(); //go next middleware
}
exports.tests = function(req, res, next) {
	res.locals.i18n = i18n.tests[res.locals.lang]; //current language
	next(); //go next middleware
}
exports.web = function(req, res, next) {
	res.locals.i18n = i18n.web[res.locals.lang]; //current language
	next(); //go next middleware
}

exports.post = function(req, res, next) { //validate all form post
	if (!valid.setInputs(req.body).validate(req.path, res.locals.i18n))
		return next(res.locals.i18n.errForm); //validate form values
	// Returns inputs and parsed data to view
	res.locals.body = req.body; //preserve client inputs
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

exports.auth = login.auth;
