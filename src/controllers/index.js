
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")
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

// Extends validators
valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("required50", function(name, value, msgs) { //usefull for codes, refs, etc.
	return valid.size(value, 1, 50) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("max200", function(name, value, msgs) { //empty or length le than 200 (optional)
	return valid.size(value, 0, 200) || !valid.setError(name, msgs.errMaxlength);
}).set("max50", function(name, value, msgs) { //empty or length le than 50 (optional)
	return valid.size(value, 0, 50) || !valid.setError(name, msgs.errMaxlength);
}).set("token", function(name, value, msgs) {
	return valid.size(value, 200, 800) || !valid.setError(name, msgs.errRegex);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs) {
	return valid.clave(name, value, msgs) && ((value == valid.getData("clave")) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) <= valid.toISODateString()) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) >= valid.toISODateString()) || !valid.setError(name, msgs.errDateGe));
}).set("pk", function(name, value, msgs) {
	if  (!value) //optional for inserts
		return true;
	if (valid.integer(name, value)) //is update
		return (valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0);
	return !valid.setError(name, msgs.errNumber);
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
});

exports.lang = function(req, res, next) {
	let lang = req.query.lang || req.session.lang;
	if (!lang || (lang !== req.session.lang)) //user change language or first access
		lang = i18n.get(lang, req.headers["accept-language"]); //get language
	req.session.lang = res.locals.lang = lang; //set lang id on session and view
	res.locals.msgs = valid.getMsgs(); //init messages
	res.locals.body = BODY; //init non-ajax body forms

	// Load specific user menus or public menus on view and session
	req.session.menus = req.session.menus || dao.web.myjson.menus.getPublic();
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
	res.locals.body = req.body; //preserve client inputs
	valid.setInputs(req.body).setI18n(res.locals.i18n); //load inputs and messages
	if (!valid.validate(req.originalUrl)) //validate inputs form
		return next(res.locals.i18n.errForm); //set error message
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
