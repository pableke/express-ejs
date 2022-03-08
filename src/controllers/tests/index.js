
const fs = require("fs"); //file system
const path = require("path"); //file and directory paths
const cp = require("child_process"); //system calls
const i18n = require("app/lib/i18n-box.js");
const util = require("app/lib/util-box.js");

exports.index = (req, res) => {
	util.render(res, "tests/index");
}

exports.email = (req, res, next) => {
	util.setBody(res, "tests/index").sendMail({
		to: "pableke@gmail.com",
		subject: req.body.asunto,
		body: "tests/emails/test.ejs",
		data: res.locals //data
	}).then(info => util.build(res, "msgCorreo"))
		.catch(err => next("errSendMail"));
}

exports.xls = function(req, res) {
	util.xls(res, {
		filename: "tests.xlsx",
		author: "Pablo Rosique Vidal",
		headers: { name: "Nombre", imp: "Importe", fCreacion: "Fecha" },
		styles: {
			imp: { numberFormat: "#,##0.00" },
			fCreacion: { dateFormat: "dd/mm/yyyy" }
		},
		data: [
			{ name: "askjld", imp: 23.87, fCreacion: new Date() },
			{ name: "fila 2", imp:2.9 },
			{ name: "fila 3", imp:24566.95675, fCreacion: "2022-01-01T10:22:53" }
		]
	});
}

exports.zip = function(req, res) {
	util.zip(res, "tests.zip", ["tests.xlsx", "Gestión_Documental.pdf", "Guías_Docentes.pdf"].map(util.getPath));
}

exports.pdf = (req, res) => {
	res.send("file pdf!");
}
