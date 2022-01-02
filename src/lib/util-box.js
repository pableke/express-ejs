
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer

const dao = require("app/dao/factory.js"); //DAO factory
const i18n = require("./i18n-box.js"); //languages

// Specific laguage list for modules
i18n.addLang("es", require("../i18n/test/es.js"), "test");
i18n.addLang("en", require("../i18n/test/en.js"), "test");
i18n.addLang("es", require("./web/es.js"), "web");
i18n.addLang("en", require("./web/en.js"), "web");

const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(__dirname, "../public/files/"),
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

exports.lang = function(req, res, mod) {
	// Search for language in request, session and headers by region: es-ES
	let lang = req.query.lang || req.session.lang || req.headers["accept-language"].substr(0, 5);
	req.session.lang = res.locals.lang = i18n.setI18n(lang, mod).get("lang"); // Get language found

	// Load specific user menus or public menus on view
	res.locals.menus = req.sessionStorage ? req.sessionStorage.menus : dao.web.myjson.menus.getPublic();
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
