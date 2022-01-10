
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const qs = require("querystring"); //parse post data
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const ab = require("./array-box.js");
const dt = require("./date-box.js");
const nb = require("./number-box.js");
const sb = require("./string-box.js");
const valid = require("./validator-box.js");
const i18n = require("./i18n-box.js");
const langs = require("../i18n/i18n.js");
const dao = require("app/dao/factory.js");

const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(__dirname, "../public/files/"),
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

i18n.addLangs(langs.main)
	.addLangs(langs.test, "test")
	.addLangs(langs.web, "web");

exports.ab = ab;
exports.dt = dt;
exports.nb = nb;
exports.sb = sb;
exports.valid = valid;
exports.i18n = i18n;

exports.menus = function(req, res, id) { // Build menus
	let lang = i18n.get("lang"); // current language
	let menus = dao.web.myjson.um.getAllMenus(id); //specific user menus
	let tpl = dao.web.myjson.menus.format(lang, menus); //build template
	res.locals.menus = req.session.menus = tpl; //set on view and session
}

exports.post = function(req, res, next) {
	let rawData = ""; // Buffer
	req.on("data", function(chunk) {
		rawData += chunk;
		if (rawData.length > UPLOADS.maxFieldsSize) {
			req.connection.destroy(); //FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
			next("err413"); //Error 413 request too large
		}
	});
	req.on("end", function() {
		req.body = (req.headers["content-type"] == "application/json") ? JSON.parse(rawData) : qs.parse(rawData);
		next();
	});
}

exports.multipart = function(req, res, next) { //validate all form post
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
