
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const dao = require("app/dao/factory.js");
const valid = require("app/validator-box.js")
const login = require("./web/public/login.js");
const i18n = require("../i18n/i18n.js"); //languages

exports.lang = function(req, res, next) {
	let lang = req.query.lang || req.session.lang;
	if (!lang || (lang !== req.session.lang)) {
		//user has changed current language or first access
		let ac = req.headers["accept-language"] || "es"; //default laguage = es
		lang = (i18n[lang]) ? lang : ac.substr(0, 5); //search region language es-ES
		lang = (i18n[lang]) ? lang : lang.substr(0, 2); //search type language es
		lang = (i18n[lang]) ? lang : "es"; //default language = es
		req.session.langs = i18n; //all languages container
		req.session.lang = lang; //save language on session
	}
	res.locals.lang = lang; //lang id
	res.locals.msgs = valid; //init messages
	//init non-ajax body forms, pointer to messages
	res.locals.body = valid.getMsgs(); //ojo! colisiones poco probables

	// Load specific user menus or load public
	req.session.menus = req.session.menus || dao.web.myjson.menus.getPublic(); //public menu
	res.locals.menus = req.session.menus; //set menus on view

	// Commons response helpers
	res.locals._tplBody = "web/index"; //default body
	res.setBody = function(tpl) {
		res.locals._tplBody = tpl; //new tpl body path
		return res;
	}
	res.build = function(tpl) {
		//set tpl body path and render index
		return res.setBody(tpl).render("index");
	}
	res.on("finish", function() {
		valid.initMsgs(); //reset data and messages
	});
	//go next middleware
	next();
}
exports.tests = function(req, res, next) {
	res.locals.i18n = i18n.tests[res.locals.lang]; //current language
	next();
}
exports.web = function(req, res, next) {
	res.locals.i18n = i18n.web[res.locals.lang]; //current language
	next();
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
					.toFile(path.join(__dirname, "public/thumb/", path.basename(file.path)))
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
